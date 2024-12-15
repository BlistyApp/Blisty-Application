import React, { useState, useRef } from "react";
import { View, Text, PanResponder, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface SwipeRatingProps {
  maxRating: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

const { width } = Dimensions.get("window");
const STAR_SIZE = 40;
const MAX_WIDTH = width * 0.7;

export function SwipeRating({
  maxRating,
  initialRating = 0,
  onRatingChange,
}: SwipeRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const starContainerRef = useRef<View>(null);

  // PanResponder para manejar el swipe
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Calcular la posición dentro del contenedor de estrellas
        const posX = Math.max(0, Math.min(MAX_WIDTH, gestureState.moveX - 20)); // Ajuste del inicio
        const newRating = Number(((posX / MAX_WIDTH) * maxRating).toFixed(1));

        setRating(newRating);
        onRatingChange && onRatingChange(newRating);
      },
    })
  ).current;

  return (
    <View className="items-center justify-center p-3">
      <Text className="font-light text-lg">Desliza para calificar</Text>
      <Text className="mt-1 mb-3 text-2xl font-bold text-primary">
        {rating}/5
      </Text>
      <View
        style={{ width: MAX_WIDTH }}
        className="flex-row justify-center"
        ref={starContainerRef}
        {...panResponder.panHandlers}
      >
        {Array.from({ length: maxRating }, (_, index) => (
          <FontAwesome
            key={index}
            name={
              index < rating
                ? index + 1 > rating
                  ? "star-half-o"
                  : "star"
                : "star-o"
            }
            size={STAR_SIZE}
            color="rgb(62 0 156)"
            style={{ marginHorizontal: 5 }}
          />
        ))}
      </View>
    </View>
  );
}
