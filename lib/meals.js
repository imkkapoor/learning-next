import sql from "better-sqlite3";

import fs from "node:fs";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

export async function getMeals() {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // try this for showing, how to handle error's in next
    //throw new Error("loading meals failed");
    return db.prepare("Select * from meals").all();
}

export function getMeal(slug) {
    return db.prepare("Select * from meals where slug = ?").get(slug);
    // don't do like this
    // return db.prepare('Select* from meals where slug =' + slug)
    // insecure - sql injection
}

export async function saveMeal(meal) {
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    // storing the image
    const extension = meal.image.name.split(".").pop();
    const fileName = `${meal.slug}.${extension}`;

    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await meal.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
        if (error) {
            throw new Error("Saving image failed!");
        }
    });

    meal.image = `/images/${fileName}`;

    db.prepare(
        `
    Insert into meals
    (title, summary, instructions, creator, creator_email, image, slug)
    values (
        @title,
        @summary,
        @instructions,
        @creator,
        @creator_email,
        @image,
        @slug
        )`
    ).run(meal);
}
