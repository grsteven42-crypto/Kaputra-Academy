import { Suspense } from "react";
import PlacementTestContent from "./PlacementTestContent";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PlacementTestContent />
        </Suspense>
    );
}