// this is for a case when a jsx camponent needs to be client side
// thus you cannot have any functions in that which have a use server
// directive

// so basically can't have both server and client directive in the same
// file, but you can import functions though

'use server';

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";

export async function shareMeal(formData) {
    // this is function that only executes on server
    "use server";

    const meal = {
        title: formData.get('title'),
        summary: formData.get('summary'),
        instructions: formData.get('instructions'),
        image: formData.get('image'),
        creator: formData.get('name'),
        creator_email: formData.get('email'),
    }

    await saveMeal(meal);
    redirect("/meals");

}