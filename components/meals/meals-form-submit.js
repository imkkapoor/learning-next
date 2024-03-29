"use client";

import { useFormStatus } from "react-dom";

export default function MealsFormSubmit() {
    // pending will be true or false based on a pending
    // request
    const { pending } = useFormStatus();

    return (
        <button disabled={pending}>
            {pending ? "Submitting..." : "Share Meal"}
        </button>
    );
}
