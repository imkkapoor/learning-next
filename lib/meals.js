import sql from "better-sqlite3";

import { S3 } from "@aws-sdk/client-s3";
import slugify from "slugify";
import xss from "xss";

// sql config
const db = sql("meals.db");

// AWS s3 bucket config
const s3 = new S3({
    region: "us-east-2"
});

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

    const bufferedImage = await meal.image.arrayBuffer();

    s3.putObject({
        Bucket: 'vinayak-nextjs-demo-users-image',
        Key: fileName,
        Body: Buffer.from(bufferedImage),
        ContentType: meal.image.type,
      });

    meal.image = fileName;

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
