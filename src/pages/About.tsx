import Mixology from "../assest/Mixology.svg";
import Events from "../assest/Events.svg";
import Food from "../assest/food.svg";
import TextMixology from "../assest/TextMixology.svg";
import TextFood from "../assest/TextFood.svg";
import TextEvents from "../assest/TextEvents.svg";
export default function About() {
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="h-1/3 w-full relative">
        <img src={Mixology} alt="Mixology" className="w-full h-full object-cover" />
        <div className="absolute top-1/2 right-[20%] -translate-y-1/2">
          <img src={TextMixology} alt="Mixology Text" className="w-[7rem] md:w-[14rem]" />
        </div>
      </div>

      <div className="h-1/3 w-full relative">
        <img src={Food} alt="Food" className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2">
          <img src={TextFood} alt="Food Text" className="w-[5rem] md:w-[10rem]" />
        </div>
      </div>

      <div className="h-1/3 w-full relative">
        <img src={Events} alt="Events" className="w-full h-full object-cover" />
        <div className="absolute bottom-4 left-1">
          <img src={TextEvents} alt="Events Text" className="w-[5rem] md:w-[10rem]" />
        </div>
      </div>
    </div>
  );
}
