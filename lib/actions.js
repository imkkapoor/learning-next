// this is for a case when a jsx camponent needs to be client side
// thus you cannot have any functions in that which have a use server
// directive

// so basically can't have both server and client directive in the same
// file, but you can import functions though

"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
    return !text || text.trim() == "";
}

export async function shareMeal(prevState, formData) {
    // this is function that only executes on server
    "use server";

    const meal = {
        title: formData.get("title"),
        summary: formData.get("summary"),
        instructions: formData.get("instructions"),
        image: formData.get("image"),
        creator: formData.get("name"),
        creator_email: formData.get("email"),
    };

    if (
        isInvalidText(meal.title) ||
        isInvalidText(meal.summary) ||
        isInvalidText(meal.instructions) ||
        isInvalidText(meal.creator) ||
        isInvalidText(meal.creator_email) ||
        !meal.image ||
        meal.image.size === 0
    ) {
        return {
            message: "Invalid input.",
        };
    }

    await saveMeal(meal);

    // when running in production mode, this revalidation is required
    // since the next caching does not let the page to be updated, we
    // need to manually clear the cache and revalidate the path.

    // the mode is set to page by default, but it can be set to layout
    // to revalidate all the paths

    revalidatePath("/meals");
    redirect("/meals");
}
