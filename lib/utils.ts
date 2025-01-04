import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const getRoomId = (uid1: string, uid2: string) => {
  return [uid1, uid2].sort().join("-");
};

export const formatDate = (date: Date, includeYear?: boolean) => {
  let day = date.getDate();
  let months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];
  return includeYear ? `${day} ${month} del ${date.getFullYear()}` : `${day} ${month}`;
};

const opciones = {
  timeZone: "America/Lima",
  year: "numeric" as "numeric",
  month: "long" as "long",
  day: "numeric" as "numeric",
  hour12: true,
};

export const formatFullDate = (date: Date) => {
  let dateString = date.toLocaleDateString("es-PE", opciones);
  return dateString;
};

const opcionesHora = {
  timeZone: "America/Lima",
  hour: "2-digit" as "numeric",
  minute: "2-digit" as "numeric",
  hour12: false,
};

export const formatHour = (date: Date) => {
  return date.toLocaleTimeString("es-PE", opcionesHora);
};

export const aiChatPetition = async (userId: string, roomId: string) => {
  console.log("Petition to AI");
  try {
    const response = await fetch(
      "https://blisty-backend.vercel.app/ai-chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          roomId: roomId,
        }),
      }
    );
    return response;
  } catch {}
};