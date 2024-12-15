import {
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { useForm, Controller } from "react-hook-form";
import { DropDownList } from "@/components/DropDownList";
import { type RegisterType } from "@/types/RegisterType";
import { DateInput } from "@/components/DateInput";
import { useEffect, useState } from "react";
import KeyboardViewCustom from "@/components/KeyboardViewCustom";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import LoadingModal from "@/components/LoadingModal";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { CheckBox } from "@/components/CheckBox";
import { Terms } from "@/components/Terms";
import { MultiSelection } from "@/components/MultiSelection";
import BlistyError from "@/lib/blistyError";
import { getTags } from "@/lib/gets";

const StyledView = styled(View);

const specializations = [
  { label: "Psicología Clínica", value: "Psicología Clínica" },
  { label: "Psicología Educativa", value: "Psicología Educativa" },
  {
    label: "Psicología Organizacional o Industrial",
    value: "Psicología Organizacional o Industrial",
  },
  {
    label: "Psicología Infantil y del Adolescente",
    value: "Psicología Infantil y del Adolescente",
  },
  { label: "Psicología Forense", value: "Psicología Forense" },
  { label: "Psicología Social", value: "Psicología Social" },
  { label: "Neuropsicología", value: "Neuropsicología" },
  { label: "Psicología de la Salud", value: "Psicología de la Salud" },
  { label: "Psicología Deportiva", value: "Psicología Deportiva" },
  {
    label: "Psicología del Trauma y Estrés Postraumático",
    value: "Psicología del Trauma y Estrés Postraumático",
  },
  {
    label: "Psicología de la Sexualidad",
    value: "Psicología de la Sexualidad",
  },
  { label: "Psicología Gerontológica", value: "Psicología Gerontológica" },
  { label: "Psicología Ambiental", value: "Psicología Ambiental" },
  {
    label: "Psicoterapia Humanista o Transpersonal",
    value: "Psicoterapia Humanista o Transpersonal",
  },
];

export default function Register() {
  const router = useRouter();
  const { register } = useFirebaseStore((state) => state);
  const {
    handleSubmit,
    control,
    watch,
    unregister,
    setError,
    formState: { errors },
  } = useForm<RegisterType>({
    defaultValues: {
      tuition_number: "",
      name: "",
      phone: "",
      email: "",
      password: "",
      terms: false,
      mTags: [],
      tags: [],
      experience: { mode: "Mas de", years: "" },
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [openTerms, setOpenTerms] = useState<boolean>(false);
  const [mTags, setMTags] = useState<{ label: string; value: string }[]>([]);
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const populateTags = async () => {
      setLoading(true);
      try {
        const { tags, mTags } = await getTags();
        console.log({ tags, mTags });
        setMTags(mTags.map((mtag) => ({ label: mtag.label, value: mtag.tag })));
        setTags(tags.map((tag) => ({ label: tag.label, value: tag.tag })));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
        if (error instanceof BlistyError) {
          if (error.code === "auth/network-request-failed") {
            router.replace("/noconnection");
            return;
          }
        }
        router.replace("/error");
      }
    };

    populateTags();
  }, []);

  const onSubmit = async (data: RegisterType) => {
    setLoading(true);
    try {
      const { experience, ...rest } = data;
      const experience_string = `${data.experience.mode} ${data.experience.years} años`;
      await register({ ...rest, experience_string });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      if (error instanceof BlistyError) {
        if (error.code === "auth/email-already-in-use") {
          setError("root", {
            type: "manual",
            message: "Correo ya registrado",
          });
          return;
        } else if (error.code === "auth/network-request-failed") {
          router.replace("/noconnection");
          return;
        }
      }
      router.replace("/error");
    }
  };

  useEffect(() => {
    if (watch("role") === "patient") {
      unregister("tuition_number");
      unregister("mTags");
      unregister("tags");
      unregister("experience");
      unregister("description");
      unregister("available_mode");
    }
  }, [watch("role")]);

  return (
    <KeyboardViewCustom scrollEnabled={true}>
      <View className="bg-white flex-1 items-center">
        <StatusBar barStyle={"light-content"} />
        <StyledView className="flex-1 absolute top-0 left-0 right-0 justify-center items-center w-full">
          <StyledView
            style={{ width: wp("100%"), height: hp("25%") }}
            className="bg-[#3e009c] overflow-hidden"
          />
          <StyledView
            style={{
              width: wp("120%"),
              height: hp("52%"),
              bottom: -1 * hp("35%"),
              right: -1 * wp("10%"),
            }}
            className="bg-white rounded-full absolute"
          />
        </StyledView>

        <Text className="absolute top-44 text-4xl font-bold text-[#3e009c]">
          Unete!
        </Text>
        <View
          style={{ paddingTop: watch("role") ? 260 : 384 }}
          className="px-6 w-full"
        >
          <View className="my-3 relative">
            <View className="my-1">
              <Label className={`${errors.role && "text-red-500"}`}>
                Tipo de usuario
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange } }) => (
                  <DropDownList
                    placeholder="Tipo de usuario"
                    data={[
                      { label: "Psicologo", value: "psychologist" },
                      { label: "Paciente", value: "patient" },
                    ]}
                    onChange={onChange}
                    error={errors.role !== undefined}
                  />
                )}
                name="role"
                rules={{ required: "Debe seleccionar un tipo de usuario" }}
              />
              {errors.role && (
                <Text className="text-red-500 text-sm">
                  {errors.role.message}
                </Text>
              )}
            </View>

            {watch("role") && (
              <>
                {watch("role") === "psychologist" && (
                  <View className="my-1">
                    <Label
                      className={`${errors.tuition_number && "text-red-500"}`}
                    >
                      Numero de Colegiatura
                    </Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder="123456789"
                          keyboardType={"numeric"}
                          onBlur={onBlur}
                          onChangeText={(value: any) => onChange(value)}
                          value={value}
                          className={`${
                            errors.tuition_number && "border-red-500"
                          }`}
                        />
                      )}
                      name="tuition_number"
                      rules={{ required: "Digite su número de colegiatura" }}
                    />
                    {"tuition_number" in errors && (
                      <Text className="text-red-500 text-sm">
                        {errors.tuition_number?.message}
                      </Text>
                    )}
                  </View>
                )}
                <View className="my-1">
                  <Label className={`${errors.name && "text-red-500"}`}>
                    Nombre
                  </Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Nombres y Apellidos"
                        keyboardType={"default"}
                        onBlur={onBlur}
                        onChangeText={(value: any) => onChange(value)}
                        value={value}
                        className={`${errors.name && "border-red-500"}`}
                      />
                    )}
                    name="name"
                    rules={{ required: "Digite su número de colegiatura" }}
                  />
                  {"name" in errors && (
                    <Text className="text-red-500 text-sm">
                      {errors.name?.message}
                    </Text>
                  )}
                </View>
                <View className="flex-row w-full">
                  <View className="my-1 w-1/2 pr-2">
                    <Label className={`${errors.phone && "text-red-500"}`}>
                      Telefono
                    </Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder="123456789"
                          onBlur={onBlur}
                          onChangeText={(value: any) => onChange(value)}
                          value={value}
                          keyboardType={"number-pad"}
                          className={`${errors.phone && "border-red-500"}`}
                        />
                      )}
                      name="phone"
                      rules={{ required: "Digite su número de telefono" }}
                    />
                    {errors.phone && (
                      <Text className="text-red-500 text-sm">
                        {errors.phone.message}
                      </Text>
                    )}
                  </View>

                  <View className="my-1 w-1/2 pl-2">
                    <Label className={`${errors.birth_day && "text-red-500"}`}>
                      Fecha de Nacimiento
                    </Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DateInput
                          value={value}
                          placeholder="MM/DD/YYYY"
                          mode="date"
                          display="default"
                          onChange={onChange}
                          error={errors.birth_day !== undefined}
                        />
                      )}
                      name="birth_day"
                      rules={{ required: "Campo necesario" }}
                    />
                    {errors.birth_day && (
                      <Text className="text-red-500 text-sm">
                        {errors.birth_day.message}
                      </Text>
                    )}
                  </View>
                </View>
                <View className="my-1">
                  <Label className={`${errors.email && "text-red-500"}`}>
                    Correo
                  </Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="example@gmail.com"
                        keyboardType={"email-address"}
                        onBlur={onBlur}
                        onChangeText={(value: any) => onChange(value)}
                        value={value}
                        className={`${errors.email && "border-red-500"}`}
                      />
                    )}
                    name="email"
                    rules={{ required: "Correo electronico es necesario" }}
                  />
                  {errors.email && (
                    <Text className="text-red-500 text-sm">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
                <View className="my-1">
                  <Label className={`${errors.password && "text-red-500"}`}>
                    Contraseña
                  </Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="*********"
                        secureTextEntry={true}
                        onBlur={onBlur}
                        onChangeText={(value: any) => onChange(value)}
                        value={value}
                        className={`${errors.password && "border-red-500"}`}
                      />
                    )}
                    name="password"
                    rules={{ required: "Contraseña es necesaria" }}
                  />
                  {errors.password && (
                    <Text className="text-red-500 text-sm">
                      {errors.password.message}
                    </Text>
                  )}
                </View>

                {watch("role") === "psychologist" && (
                  <>
                    <View className="my-1">
                      <Label className={`${errors.mTags && "text-red-500"}`}>
                        Especializacionnes Principales
                      </Label>
                      <Controller
                        name="mTags"
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <>
                            <MultiSelection
                              data={mTags}
                              onChange={onChange}
                              selecteds={value}
                              placeholder="Selecciona una especialización"
                              error={errors.mTags !== undefined}
                            />
                            {value.length > 0 && (
                              <View
                                style={{ marginTop: hp("1%") }}
                                className="flex flex-col"
                              >
                                <Text className="text-sm font-bold">
                                  Especializaciones seleccionadas:{" "}
                                </Text>
                                <Text className="text-sm ">
                                  {mTags
                                    .filter((mTag) =>
                                      value.includes(mTag.value)
                                    )
                                    .map((mTag) => mTag.label)
                                    .join(", ")}
                                </Text>
                              </View>
                            )}
                          </>
                        )}
                        rules={{
                          min: 1,
                          required:
                            "Debe ingresar almenos una especialización principal",
                        }}
                      />
                      {errors.mTags && (
                        <Text className="text-red-500 text-sm">
                          {errors.mTags.message}
                        </Text>
                      )}
                    </View>
                    <View className="my-1">
                      <Label className={`${errors.tags && "text-red-500"}`}>
                        Especializacionnes Secundarias
                      </Label>
                      <Controller
                        name="tags"
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <>
                            <MultiSelection
                              data={tags}
                              onChange={onChange}
                              selecteds={value}
                              placeholder="Selecciona una especialización"
                              error={errors.tags !== undefined}
                            />
                            {value.length > 0 && (
                              <View
                                style={{ marginTop: hp("1%") }}
                                className="flex flex-col"
                              >
                                <Text className="text-sm font-bold">
                                  Especializaciones seleccionadas:{" "}
                                </Text>
                                <Text className="text-sm ">
                                  {tags
                                    .filter((tag) => value.includes(tag.value))
                                    .map((tag) => tag.label)
                                    .join(", ")}
                                </Text>
                              </View>
                            )}
                          </>
                        )}
                        rules={{
                          min: 1,
                          required:
                            "Debe ingresar almenos una especialización secundaria",
                        }}
                      />
                      {errors.tags && (
                        <Text className="text-red-500 text-sm">
                          {errors.tags.message}
                        </Text>
                      )}
                    </View>
                    <View className="my-1">
                      <Label
                        className={`${errors.experience && "text-red-500"}`}
                      >
                        Experiencia
                      </Label>
                      <View className="flex flex-row w-full items-center">
                        <Controller
                          name="experience.mode"
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <DropDownList
                              data={[
                                { label: "Mas de", value: "Mas de" },
                                { label: "Exactamente", value: "Exactamente" },
                                { label: "Menos de", value: "Menos de" },
                              ]}
                              onChange={onChange}
                              defaultValue="Mas de"
                              placeholder="Tipo"
                              error={errors.experience?.mode !== undefined}
                              style={{ width: wp("40%") }}
                            />
                          )}
                          rules={{
                            required: "Es necesario ingresar la experiencia",
                          }}
                        />
                        <Controller
                          name="experience.years"
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                              placeholder="Años"
                              keyboardType={"number-pad"}
                              onChangeText={(value: any) => onChange(value)}
                              style={{ width: wp("40%"), marginLeft: wp("3%") }}
                              value={value}
                              className={`${
                                errors.experience?.years && "border-red-500"
                              }`}
                            />
                          )}
                          rules={{
                            required: "Es necesario ingresar los años",
                          }}
                        />
                      </View>
                      {errors.experience && (
                        <Text className="text-red-500 text-sm flex flex-col">
                          {errors.experience?.mode?.message}
                          {"\n"}
                          {errors.experience?.years?.message}
                        </Text>
                      )}
                    </View>

                    <View className="my-1">
                      <Label
                        className={`${errors.available_mode && "text-red-500"}`}
                      >
                        Disponibilidad
                      </Label>
                      <Controller
                        control={control}
                        render={({ field: { onChange } }) => (
                          <DropDownList
                            placeholder="Tipo de usuario"
                            data={[
                              { label: "Presencial", value: "Presencial" },
                              { label: "Virtual", value: "Virtual" },
                              {
                                label: "Presencial y Virtual",
                                value: "Presencial y Virtual",
                              },
                            ]}
                            onChange={onChange}
                            error={errors.available_mode !== undefined}
                          />
                        )}
                        name="available_mode"
                        rules={{
                          required: "Debe seleccionar un tipo de usuario",
                        }}
                      />
                      {errors.available_mode && (
                        <Text className="text-red-500 text-sm">
                          {errors.available_mode.message}
                        </Text>
                      )}
                    </View>

                    <View className="my-1">
                      <Label
                        className={`${errors.description && "text-red-500"}`}
                      >
                        Descripción
                      </Label>
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <View
                            className={`${
                              errors.description && "border-red-500"
                            } w-full border-2 rounded-lg px-3 py-2`}
                          >
                            <TextInput
                              placeholder="Comentanos sobre ti...."
                              keyboardType={"default"}
                              onChangeText={(value: any) => onChange(value)}
                              style={{
                                minHeight: hp("5%"),
                                maxHeight: hp("10%"),
                              }}
                              scrollEnabled={true}
                              multiline={true}
                              value={value}
                            />
                          </View>
                        )}
                        name="description"
                        rules={{
                          required: "Es necesario ingresar una descripción",
                        }}
                      />
                      {errors.description && (
                        <Text className="text-red-500 text-sm">
                          {errors.description.message}
                        </Text>
                      )}
                    </View>
                  </>
                )}
                <View className="my-3">
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <View className="flex flex-row items-center">
                        <CheckBox checked={value} onChecked={onChange} />
                        <Text
                          style={{ marginLeft: wp("2%") }}
                          className="text-sm"
                        >
                          Acepto los{" "}
                        </Text>
                        <Pressable onPress={() => setOpenTerms(!openTerms)}>
                          <Text className="text-[#3e009c] underline">
                            Terminos y Condiciones
                          </Text>
                        </Pressable>
                        <Terms
                          open={openTerms}
                          onClose={() => setOpenTerms(false)}
                        />
                      </View>
                    )}
                    name="terms"
                    rules={{
                      required:
                        "Los terminos y condiciones deben ser aceptados.",
                    }}
                  />
                  {errors.terms && (
                    <Text className="text-red-500 text-sm">
                      {errors.terms.message}
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>

          {errors.root && (
            <Text className="text-red-500 text-sm">{errors.root.message}</Text>
          )}
          <Pressable
            style={{ marginTop: hp("2%"), paddingVertical: hp("1%") }}
            className="bg-[#3e009c] h-12 rounded-full items-center justify-center"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white font-bold text-lg text-center">
              Registrar
            </Text>
          </Pressable>

          <Pressable
            className="h-12 rounded-full py-2 my-2 items-center justify-center"
            onPress={() => {
              router.replace("/(auth)/login");
            }}
          >
            <Text className="font-light text-lg text-center">
              Ya tienes una cuenta?{" "}
              <Text className="text-[#3e009c] font-semibold underline">
                Inicia Sesión
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
      <LoadingModal loading={loading} />
    </KeyboardViewCustom>
  );
}
