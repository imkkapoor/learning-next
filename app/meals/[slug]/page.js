import Image from "next/image";
import classes from "./page.module.css";
import { getMeal } from "@/lib/meals";
import { notFound } from "next/navigation";

// dynamic meta-data
export async function generateMetadata({ params }) {
    const meal = getMeal(params.slug);
    
    if (!meal) {
        notFound();
    }

    return {
        title: meal.title,
        description: meal.summary,
    };
}

export default function Meal({ params }) {
    const meal = getMeal(params.slug);
    if (!meal) {
        // this is used by next to show the closest not
        // found error page
        notFound();
    }
    meal.instructions = meal.instructions.replace(/\n/g, "<br />");
    return (
        <>
            <header className={classes.header}>
                <div className={classes.image}>
                    <Image
                        src={`https://vinayak-nextjs-demo-users-image.s3.us-east-2.amazonaws.com/${meal.image}`}
                        alt={meal.title}
                        fill
                    />
                </div>
                <div className={classes.headerText}>
                    <h1>{meal.title}</h1>
                    <p className={classes.creator}>
                        by{" "}
                        <a href={`mailto:${meal.creator_email}`}>
                            {meal.creator}
                        </a>
                        <p className={classes.summary}>{meal.summary}</p>
                    </p>
                </div>
            </header>
            <main>
                <p
                    className={classes.instructions}
                    dangerouslySetInnerHTML={{
                        __html: meal.instructions,
                    }}
                ></p>
            </main>
            ;
        </>
    );
}
