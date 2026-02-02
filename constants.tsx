import { GameTheme, ItemType } from './types';
import { 
  AppleIcon, BallIcon, StarIcon, DiceIcon,
  CatIcon, DogIcon, FishIcon, BirdIcon,
  SunIcon, FlowerIcon, TreeIcon, IceCreamIcon,
  CarIcon, BoatIcon, PlaneIcon, TrainIcon,
  RocketIcon, PlanetIcon, MoonIcon, UfoIcon,
  PizzaIcon, BurgerIcon, DonutIcon, FriesIcon,
  SoccerIcon, BasketballIcon, TennisIcon, BaseballIcon,
  BookIcon, PencilIcon, BackpackIcon, RulerIcon
} from './components/GameIcons';

export const THEMES: GameTheme[] = [
  {
    id: 'classic',
    name: 'Ting & Sager',
    buckets: [
      {
        type: ItemType.APPLE,
        label: 'Æbler',
        color: 'bg-red-500',
        fill: '#ef4444',
        icon: AppleIcon,
      },
      {
        type: ItemType.BALL,
        label: 'Bolde',
        color: 'bg-blue-500',
        fill: '#3b82f6',
        icon: BallIcon,
      },
      {
        type: ItemType.STAR,
        label: 'Stjerner',
        color: 'bg-yellow-400',
        fill: '#facc15',
        icon: StarIcon,
      },
      {
        type: ItemType.DICE,
        label: 'Terninger',
        color: 'bg-purple-500',
        fill: '#a855f7',
        icon: DiceIcon,
      },
    ]
  },
  {
    id: 'animals',
    name: 'Dyrevenner',
    buckets: [
      {
        type: ItemType.CAT,
        label: 'Katte',
        color: 'bg-orange-400',
        fill: '#fb923c',
        icon: CatIcon,
      },
      {
        type: ItemType.DOG,
        label: 'Hunde',
        color: 'bg-yellow-700',
        fill: '#a16207',
        icon: DogIcon,
      },
      {
        type: ItemType.FISH,
        label: 'Fisk',
        color: 'bg-blue-400',
        fill: '#60a5fa',
        icon: FishIcon,
      },
      {
        type: ItemType.BIRD,
        label: 'Fugle',
        color: 'bg-green-400',
        fill: '#4ade80',
        icon: BirdIcon,
      },
    ]
  },
  {
    id: 'summer',
    name: 'Sommer',
    buckets: [
      {
        type: ItemType.SUN,
        label: 'Sole',
        color: 'bg-yellow-500',
        fill: '#eab308',
        icon: SunIcon,
      },
      {
        type: ItemType.FLOWER,
        label: 'Blomster',
        color: 'bg-pink-500',
        fill: '#ec4899',
        icon: FlowerIcon,
      },
      {
        type: ItemType.TREE,
        label: 'Træer',
        color: 'bg-green-600',
        fill: '#16a34a',
        icon: TreeIcon,
      },
      {
        type: ItemType.ICECREAM,
        label: 'Is',
        color: 'bg-rose-300',
        fill: '#fda4af',
        icon: IceCreamIcon,
      },
    ]
  },
  {
    id: 'vehicles',
    name: 'Køretøjer',
    buckets: [
      {
        type: ItemType.CAR,
        label: 'Biler',
        color: 'bg-red-600',
        fill: '#dc2626',
        icon: CarIcon,
      },
      {
        type: ItemType.BOAT,
        label: 'Både',
        color: 'bg-blue-600',
        fill: '#2563eb',
        icon: BoatIcon,
      },
      {
        type: ItemType.PLANE,
        label: 'Flyvere',
        color: 'bg-sky-400',
        fill: '#38bdf8',
        icon: PlaneIcon,
      },
      {
        type: ItemType.TRAIN,
        label: 'Tog',
        color: 'bg-green-700',
        fill: '#15803d',
        icon: TrainIcon,
      },
    ]
  },
  {
    id: 'space',
    name: 'Rummet',
    buckets: [
      {
        type: ItemType.ROCKET,
        label: 'Raketter',
        color: 'bg-orange-500',
        fill: '#f97316',
        icon: RocketIcon,
      },
      {
        type: ItemType.PLANET,
        label: 'Planeter',
        color: 'bg-purple-600',
        fill: '#9333ea',
        icon: PlanetIcon,
      },
      {
        type: ItemType.MOON,
        label: 'Måner',
        color: 'bg-slate-400',
        fill: '#94a3b8',
        icon: MoonIcon,
      },
      {
        type: ItemType.UFO,
        label: 'UFOer',
        color: 'bg-lime-500',
        fill: '#84cc16',
        icon: UfoIcon,
      },
    ]
  },
  {
    id: 'food',
    name: 'Mad',
    buckets: [
      {
        type: ItemType.PIZZA,
        label: 'Pizza',
        color: 'bg-orange-300',
        fill: '#fdba74',
        icon: PizzaIcon,
      },
      {
        type: ItemType.BURGER,
        label: 'Burgere',
        color: 'bg-yellow-600',
        fill: '#ca8a04',
        icon: BurgerIcon,
      },
      {
        type: ItemType.DONUT,
        label: 'Donuts',
        color: 'bg-pink-400',
        fill: '#f472b6',
        icon: DonutIcon,
      },
      {
        type: ItemType.FRIES,
        label: 'Pomfritter',
        color: 'bg-red-500',
        fill: '#ef4444',
        icon: FriesIcon,
      },
    ]
  },
  {
    id: 'sports',
    name: 'Sport',
    buckets: [
      {
        type: ItemType.SOCCER,
        label: 'Fodbold',
        color: 'bg-gray-800',
        fill: '#1f2937',
        icon: SoccerIcon,
      },
      {
        type: ItemType.BASKETBALL,
        label: 'Basket',
        color: 'bg-orange-600',
        fill: '#ea580c',
        icon: BasketballIcon,
      },
      {
        type: ItemType.TENNIS,
        label: 'Tennis',
        color: 'bg-lime-400',
        fill: '#a3e635',
        icon: TennisIcon,
      },
      {
        type: ItemType.BASEBALL,
        label: 'Baseball',
        color: 'bg-stone-400',
        fill: '#a8a29e',
        icon: BaseballIcon,
      },
    ]
  },
  {
    id: 'school',
    name: 'Skole',
    buckets: [
      {
        type: ItemType.BOOK,
        label: 'Bøger',
        color: 'bg-blue-700',
        fill: '#1d4ed8',
        icon: BookIcon,
      },
      {
        type: ItemType.PENCIL,
        label: 'Blyanter',
        color: 'bg-yellow-300',
        fill: '#fde047',
        icon: PencilIcon,
      },
      {
        type: ItemType.BACKPACK,
        label: 'Tasker',
        color: 'bg-red-400',
        fill: '#f87171',
        icon: BackpackIcon,
      },
      {
        type: ItemType.RULER,
        label: 'Linealer',
        color: 'bg-amber-200',
        fill: '#fde68a',
        icon: RulerIcon,
      },
    ]
  }
];

export const TOTAL_ITEMS_TO_SPAWN = 20;
// Fallback initial state
export const INITIAL_BUCKETS = THEMES[0].buckets;