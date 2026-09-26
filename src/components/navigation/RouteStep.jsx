import {
  MapPin,
  Accessibility,
  Footprints,
  Train,
} from "lucide-react";

function RouteStep({ name, description, type, isLast }) {

  const icons = {
    entrance: MapPin,
    ramp: Accessibility,
    lift: Accessibility,
    corridor: Footprints,
    platform: Train,
  };

  const Icon = icons[type] || MapPin;

  return (
    <div className="relative flex gap-4">

      <div className="flex flex-col items-center">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0EA] text-[#52725F]">
          <Icon size={20} />
        </div>

        {!isLast && (
          <div className="my-2 h-9 w-px bg-[#CBD4CC]" />
        )}

      </div>

      <div className="pt-1">

        <h3 className="font-semibold text-[#14251D]">
          {name}
        </h3>

        <p className="mt-1 text-sm text-[#78817C]">
          {description}
        </p>

      </div>

    </div>
  );
}

export default RouteStep;