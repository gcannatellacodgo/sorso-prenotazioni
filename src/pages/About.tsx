import Mixology from "../assest/Mixology.svg";
import Events from "../assest/Events.svg";
import Food from "../assest/food.svg";
import TextMixology from "../assest/TextMixology.svg";
import TextFood from "../assest/TextFood.svg";
import TextEvents from "../assest/TextEvents.svg";

export default function About() {
  return (
    <div className="h-full w-full flex flex-col min-h-0">
      {/* MIXOLOGY */}
      <div className="flex-1 w-full relative min-h-0">
        <img
          src={Mixology}
          alt="Mixology"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1/2 right-1/10 -translate-y-1/2 z-10">
          <img
            src={TextMixology}
            alt="Mixology Text"
            className="w-[7rem] md:w-[14rem]"
          />
        </div>
      </div>

      {/* FOOD */}
      <div className="flex-1 w-full relative min-h-0">
        <img
          src={Food}
          alt="Food"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1 right-2 z-10">
          <img
            src={TextFood}
            alt="Food Text"
            className="w-[5rem] md:w-[10rem]"
          />
        </div>
      </div>

      {/* EVENTS */}
      <div className="flex-1 w-full relative min-h-0">
        <img
          src={Events}
          alt="Events"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-2 z-10">
          <img
            src={TextEvents}
            alt="Events Text"
            className="w-[5rem] md:w-[10rem]"
          />
        </div>
      </div>
    </div>
  );
}
