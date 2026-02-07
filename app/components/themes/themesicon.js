'use client';

import {
    Sun, Moon, Gift, Car, Gem, Building2, Sunset, Radio, Zap, Heart,
    Ghost, Flower2, Trees, Droplets, Coffee, Palette, Wand2, Grid,
    Crown, Skull, Printer, Leaf, Briefcase, TestTube, GlassWater,
    MoonStar, Snowflake, EyeOff, Mountain
} from "lucide-react";

const iconMap = {
    light: Sun,
    dark: Moon,
    cupcake: Gift,
    bumblebee: Car,
    emerald: Gem,
    corporate: Building2,
    synthwave: Sunset,
    retro: Radio,
    cyberpunk: Zap,
    valentine: Heart,
    halloween: Ghost,
    garden: Flower2,
    forest: Trees,
    aqua: Droplets,
    lofi: Coffee,
    pastel: Palette,
    fantasy: Wand2,
    wireframe: Grid,
    black: Moon,
    luxury: Crown,
    dracula: Skull,
    cmyk: Printer,
    autumn: Leaf,
    business: Briefcase,
    acid: TestTube,
    lemonade: GlassWater,
    night: MoonStar,
    coffee: Coffee,
    winter: Snowflake,
    dim: EyeOff,
    nord: Mountain,
    sunset: Sunset,
};

const ThemeIcons = ({ name, className }) => {
    const Icon = iconMap[name] || Flower2;
    return <Icon className={className} />;
};

export default ThemeIcons;
