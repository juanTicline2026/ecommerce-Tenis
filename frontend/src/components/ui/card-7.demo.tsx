import { InteractiveProductCard } from "@/components/ui/card-7";
import { Footprints } from "lucide-react";

export default function InteractiveProductCardDemo() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-background p-4">
      <InteractiveProductCard
        title="Nike M2K Tekno"
        description="Elevate Your Every Step"
        price="$149"
        imageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
        logoUrl=""
        logo={<Footprints className="h-5 w-5 text-white" aria-label="Brand logo" />}
      />
    </div>
  );
}
