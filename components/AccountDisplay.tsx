import { styled } from "nativewind";
import { View, Dimensions } from "react-native";
import { Image } from "expo-image";
import { ProfileIcon } from "@/components/icons/Icons";
import { blurhash } from "@/lib/utils";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const StyledView = styled(View);
const { height } = Dimensions.get("window");

interface AccountDisplayProps {
  profilePic?: string;
}

export default function AccountDisplay({ profilePic }: AccountDisplayProps) {
  return (
    <View
      style={{ height: height * 0.4 }}
      className="flex relative w-full justify-center items-center"
    >
      <StyledView
        style={{
          width: height,
          height,
          marginBottom: -height / 6,
          left: -height / 7,
        }}
        className="flex-1 justify-center items-center transform rotate-45 bottom-full"
      >
        <StyledView className="bg-primary w-full h-full rounded-[150px] relative">
          <View style={{width: wp("50%"), aspectRatio: 1, bottom: hp("10%"), right: hp("9%")}} className="bg-white absolute p-2 rounded-full -rotate-45">
            <View className=" bg-primary flex h-full w-full justify-center items-center rounded-full ">
              {profilePic ? (
                <Image
                  style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    borderRadius: 100,
                  }}
                  source={{ uri: profilePic }}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={500}
                />
              ) : (
                <ProfileIcon size={100} color="white" />
              )}
            </View>
          </View>
        </StyledView>
      </StyledView>
    </View>
  );
}
