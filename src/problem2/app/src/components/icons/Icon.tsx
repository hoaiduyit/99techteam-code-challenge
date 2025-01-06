import {
  Web3Icons,
  Web3IconList,
  Dictionary,
  Web3Synonyms,
} from "./web3-icon-list";

type IconProps = {
  icon: string;
  className?: string;
};

type IconType = string;

const findIconName = (
  iconList: string[],
  synonyms: Dictionary,
  icon: IconType | string,
) => {
  if (!iconList.find((item) => item === icon)) {
    return "unknown";
  }
  const baseIconName = icon;
  // check if base icon name has a synonym
  const found = synonyms[baseIconName];
  return found || baseIconName;
};

export const Icon = ({ icon, className }: IconProps) => {
  const categories = [{ name: "web3", icons: Web3IconList }];
  let category;
  for (let i = 0; i < categories.length; i += 1) {
    const cat = categories[i];
    const found = cat.icons.includes(icon);
    if (found) {
      category = cat.name;
      break;
    }
  }

  if (category === "web3") {
    return <Icon.Web3 icon={icon} className={className} />;
  }
  return <></>;
};

Icon.Web3 = ({ icon, className }: IconProps) => {
  const computedIconName = findIconName(Web3IconList, Web3Synonyms, icon);
  return (
    <div className={`${className || ""}`}>{Web3Icons[computedIconName]}</div>
  );
};
