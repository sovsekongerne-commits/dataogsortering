import React from 'react';

export enum ItemType {
  // Classic
  APPLE = 'APPLE',
  BALL = 'BALL',
  STAR = 'STAR',
  DICE = 'DICE',
  // Animals
  CAT = 'CAT',
  DOG = 'DOG',
  FISH = 'FISH',
  BIRD = 'BIRD',
  // Summer
  SUN = 'SUN',
  FLOWER = 'FLOWER',
  TREE = 'TREE',
  ICECREAM = 'ICECREAM',
  // Vehicles
  CAR = 'CAR',
  BOAT = 'BOAT',
  PLANE = 'PLANE',
  TRAIN = 'TRAIN',
  // Space
  ROCKET = 'ROCKET',
  PLANET = 'PLANET',
  MOON = 'MOON',
  UFO = 'UFO',
  // Food
  PIZZA = 'PIZZA',
  BURGER = 'BURGER',
  DONUT = 'DONUT',
  FRIES = 'FRIES',
  // Sports
  SOCCER = 'SOCCER',
  BASKETBALL = 'BASKETBALL',
  TENNIS = 'TENNIS',
  BASEBALL = 'BASEBALL',
  // School
  BOOK = 'BOOK',
  PENCIL = 'PENCIL',
  BACKPACK = 'BACKPACK',
  RULER = 'RULER'
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