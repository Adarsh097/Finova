"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


const serializeTransaction = (obj)=>{
    const serialized = {...obj};

    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }
    return serialized;
};

export  async function createAccount(data) {
    try{
        const {userId} = await auth();
        if(!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
        });

        if(!user){
            throw new Error("User not found");
        }

        //! Convert balance to float before saving
        const balanceFloat = parseFloat(data.balance);

        if(isNaN(balanceFloat)){
            throw new Error("Invalid balance format");
        }

        //!check if this is user's first account

        const existingAccounts = await db.account.findMany({
            where: {
                userId: user.id
            },
        });

        const shouldBeDefault = existingAccounts.length === 0 ?true : data.isDefault;

        //! if this is account is user's default then, set other accounts to non-default
        if(shouldBeDefault){
            await db.account.updateMany({
                where: {
                    userId : user.id, isDefault : true
                },
                data: {
                    isDefault : false
                }
            })
        }

        //! create the current account

        const account = await db.account.create({
            data: {
                ...data,
                balance : balanceFloat,
                userId : user.id,
                isDefault : shouldBeDefault,
            },
        })

        //!serialize the account before returning
        const serializedAccount = serializeTransaction(account);
        
        //? This forces Next.js to refresh the /dashboard page so that the new account appears instantly
        revalidatePath("/dashboard");
        return {
            success: true,
            data : serializedAccount
        };


    }catch(error){
        throw new Error(error.message);
    }
}