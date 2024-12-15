import { View, Modal, Text, Pressable } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
export function Terms({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal animationType="fade" visible={open} transparent>
      <View
        style={{
          height: hp("100%"),
          width: wp("100%"),
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        className="justify-center items-center"
      >
        <View
          style={{ height: hp("80%"), width: wp("95%") }}
          className="bg-white rounded-2xl justify-center items-center"
        >
          <Text style={{ fontSize: hp("2.5%") }} className="font-bold">
            Terminos y Condiciones
          </Text>
          <Text style={{ fontSize: hp("2%") }} className="text-justify p-6">
            Al utilizar nuestra aplicación de chat, aceptas que la información
            que compartas, incluidos mensajes y datos personales, será
            almacenada de forma segura y analizada con fines de mejora de los
            servicios y estudios internos, siempre garantizando el anonimato.
            Nos comprometemos a proteger tu privacidad y nunca divulgaremos,
            venderemos ni compartiremos tu información con terceros, salvo que
            sea requerido por ley. Recuerda que el uso de esta plataforma no
            reemplaza la atención psicológica profesional presencial.
          </Text>
          <Pressable
            style={{
              marginTop: hp("2%"),
              paddingVertical: hp("1%"),
            }}
            onPress={onClose}
            className="bg-primary rounded-full w-1/2 items-center justify-center"
          >
            <Text
              style={{ fontSize: hp("2%") }}
              className="font-bold text-white"
            >
              Cerrar
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
