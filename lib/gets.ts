import { collection, query, where, getDocs } from "firebase/firestore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { User } from "@/stores/Types";
import BlistyError from "./blistyError";
import { TagType } from "@/types/TagType";
export const getPsycos = async (uids: string[]) => {
  const { db } = useFirebaseStore.getState();
  if (!db) return;
  const psicosRef = collection(db, "users");
  const psicosQuery = query(psicosRef, where("uid", "in", uids));
  let data = [] as User[];
  await getDocs(psicosQuery).then((querySnapshot) => {
    querySnapshot.docs.map((doc) => {
      data.push({
        name: doc.data().name,
        uid: doc.data().uid,
        profile_pic: doc.data().profile_pic,
        tuition_number: doc.data().tuition_number,
      } as User);
    });
  });
  return data;
};

export const getUsersData = async (uids: string[]) => {
  const { db } = useFirebaseStore.getState();
  if (!db) return;
  const usersRef = collection(db, "users");
  const usersQuery = query(usersRef, where("uid", "in", uids));
  let data = [] as User[];

  const querySnapshot = await getDocs(usersQuery);

  for (const doc of querySnapshot.docs) {
    const userData = doc.data();
    console.log("DATA USER");
    console.log(userData);
    if (typeof userData.tuition_number === "string") {
      const tagsRef = query(
        collection(db, "tags"),
        where("tag", "in", userData.tags)
      );
      const tagsSnap = await getDocs(tagsRef);
      const tagsData = tagsSnap.docs.map((doc) => doc.data().label);

      const mTagsRef = query(
        collection(db, "master-tags"),
        where("tag", "in", userData.mTags)
      );
      const mTagsSnap = await getDocs(mTagsRef);
      const mTagsData = mTagsSnap.docs.map((doc) => doc.data().label);

      console.log("TAGS DATA");
      console.log(tagsData);
      console.log("MTAGS DATA");
      console.log(mTagsData);

      data.push({
        name: userData?.name as string,
        email: userData?.email as string,
        profile_pic: userData?.profilePic as string,
        uid: userData?.uid as string,
        role: userData.role as "psychologist" | "patient",
        tuition_number: Number(userData.tuition_number),
        birth_day: userData.birth_day,
        phone: userData.phone as string,
        mTags: mTagsData,
        tags: tagsData,
        experience: userData.experience_string,
        description: userData.description,
        available_mode: userData.available_mode,
      });
    } else {
      data.push({
        name: userData?.name as string,
        email: userData?.email as string,
        profile_pic: userData?.profilePic as string,
        uid: userData?.uid as string,
        role: userData.role as "psychologist" | "patient",
        birth_day: userData.birth_day,
        phone: userData.phone as string,
      });
    }
  }
  return data;
};

export const getTags = async () => {
  const { db } = useFirebaseStore.getState();
  if (!db) throw new BlistyError("Hubo un error al obtener los tags");

  const tagsRef = collection(db, "tags");
  const tagsQuery = query(tagsRef);
  let data = { tags: [] as TagType[], mTags: [] as TagType[] };
  await getDocs(tagsQuery).then((querySnapshot) => {
    querySnapshot.docs.map((doc) => {
      data.tags.push({
        id: doc.data().id,
        label: doc.data().label,
      });
    });
  });

  const mTagsRef = collection(db, "master-tags");
  const mTagsQuery = query(mTagsRef);
  await getDocs(mTagsQuery).then((querySnapshot) => {
    querySnapshot.docs.map((doc) => {
      data.mTags.push({
        id: doc.data().id,
        label: doc.data().label,
      });
    });
  });

  return data;
};

export const getLabelTags = async (tags: string[], mTags: string) => {
  const { db } = useFirebaseStore.getState();
  if (!db) throw new BlistyError("Hubo un error al obtener los tags");

  const tagsRef = query(collection(db, "tags"), where("tag", "in", tags));
  const tagsSnap = await getDocs(tagsRef);
  const tagsData = tagsSnap.docs.map((doc) => doc.data().label);

  const mTagsRef = query(
    collection(db, "master-tags"),
    where("tag", "in", mTags)
  );
  const mTagsSnap = await getDocs(mTagsRef);
  const mTagsData = mTagsSnap.docs.map((doc) => doc.data().label);

  return { tags: tagsData, mTags: mTagsData };
};
