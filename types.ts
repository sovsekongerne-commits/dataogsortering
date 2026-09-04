import React from 'react';

export enum ItemType {
  APPLE = 'APPLE',
  BALL = 'BALL',
  STAR = 'STAR',
  DICE = 'DICE',
  CAT = 'CAT',
  DOG = 'DOG',
  FISH = 'FISH',
  BIRD = 'BIRD',
  SUN = 'SUN',
  FLOWER = 'FLOWER',
  TREE = 'TREE',
  ICECREAM = 'ICECREAM',
  CAR = 'CAR',
  BOAT = 'BOAT',
  PLANE = 'PLANE',
  TRAIN = 'TRAIN',
  ROCKET = 'ROCKET',
  PLANET = 'PLANET',
  MOON = 'MOON',
  UFO = 'UFO',
  PIZZA = 'PIZZA',
  BURGER = 'BURGER',
  DONUT = 'DONUT',
  FRIES = 'FRIES',
  SOCCER = 'SOCCER',
  BASKETBALL = 'BASKETBALL',
  TENNIS = 'TENNIS',
  BASEBALL = 'BASEBALL',
  BOOK = 'BOOK',
  PENCIL = 'PENCIL',
  BACKPACK = 'BACKPACK',
  RULER = 'RULER',
  BANANA = 'BANANA',
  ORANGE_FRUIT = 'ORANGE_FRUIT',
  PEAR = 'PEAR',
  WATERMELON = 'WATERMELON',
  CARROT = 'CARROT',
  TOMATO = 'TOMATO',
  CUCUMBER = 'CUCUMBER',
  EGGPLANT = 'EGGPLANT',
  COW = 'COW',
  PIG = 'PIG',
  SHEEP = 'SHEEP',
  HORSE = 'HORSE',
  LION = 'LION',
  ELEPHANT = 'ELEPHANT',
  GIRAFFE = 'GIRAFFE',
  ZEBRA = 'ZEBRA',
  SHARK = 'SHARK',
  WHALE = 'WHALE',
  DOLPHIN = 'DOLPHIN',
  OCTOPUS = 'OCTOPUS',
  BEE = 'BEE',
  BUTTERFLY = 'BUTTERFLY',
  LADYBUG = 'LADYBUG',
  SPIDER = 'SPIDER',
  GUITAR = 'GUITAR',
  PIANO = 'PIANO',
  TRUMPET = 'TRUMPET',
  FLUTE = 'FLUTE',
  SWEATER = 'SWEATER',
  PANTS = 'PANTS',
  DRESS = 'DRESS',
  BEANIE = 'BEANIE',
  CHAIR = 'CHAIR',
  TABLE = 'TABLE',
  BED = 'BED',
  SOFA = 'SOFA',
  CAKE = 'CAKE',
  CHOCOLATE = 'CHOCOLATE',
  LOLLIPOP = 'LOLLIPOP',
  POPCORN = 'POPCORN',
  FIREFIGHTER = 'FIREFIGHTER',
  POLICE = 'POLICE',
  DOCTOR = 'DOCTOR',
  CHEF = 'CHEF',
  EYE = 'EYE',
  EAR = 'EAR',
  NOSE = 'NOSE',
  MOUTH = 'MOUTH',
}

export interface BucketData {
  type: ItemType;
  label: string;
  color: string; // Tailwind color class for bg
  fill: string; // Hex code for Recharts
  icon: React.ElementType;
  count: number;
}

export interface DraggableObject {
  id: string;
  type: ItemType;
  isSorted?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizResponse {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GameTheme {
  id: string;
  name: string;
  buckets: Omit<BucketData, 'count'>[];
}
