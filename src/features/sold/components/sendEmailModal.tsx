import { GmailAdapter } from "@/features/email/repositories/adapters/GmailAdapter";
import EmailService from "@/features/email/repositories/services/email.service";
import { ExpoPrintAdapter } from "@/features/print/repositories/adpters/expo-print-adapter";
import { DadosFatura } from "@/features/print/types";
import { GeneralHeader } from "@/shared/components/general_header";
import { Input } from "@/shared/components/input";
import blobToBase64 from "@/shared/helpers/blobtoBase64";
import isValidEmail from "@/shared/helpers/validEmail";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  onClose: () => void;
  faturaDada: DadosFatura;
}

const expoprint = new ExpoPrintAdapter();
const emailservice = new EmailService(new GmailAdapter());

export const SendEmailModal = ({ visible, onClose, faturaDada }: Props) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const now = new Date().toLocaleDateString();

  const handleClose = () => {
    if (sending) return;

    setEmail("");
    onClose();
  };

  const handleSendEmail = async () => {
    if (!faturaDada) return;

    const recipientEmail = email.trim();

    if (!recipientEmail) {
      Alert.alert("Atenção", "Digite o email do destinatário.");
      return;
    }

    if (!isValidEmail(recipientEmail)) {
      Alert.alert("Atenção", "Digite um email válido.");
      return;
    }

    try {
      setSending(true);

      const uri = await expoprint.printToFile(faturaDada);

      const response = await fetch(uri);
      const blob = await response.blob();

      const base64 = await blobToBase64(blob);

      await emailservice.sendEmail({
        to: recipientEmail,
        subject: "Envio da fatura",
        body: `Olá,

Segue em anexo a sua fatura em formato PDF.

Obrigado.

Este email foi enviado automaticamente pelo Kamba App Business.`,
        attachment: {
          base64,
          filename: `faturas_kamba_${now}.pdf`,
          mimeType: "application/pdf",
        },
      });

      Alert.alert("Sucesso", "Fatura enviada por email.");
      handleClose();
    } catch (error) {
      console.error("Erro ao enviar fatura:", error);

      Alert.alert("Erro", "Não foi possível enviar a fatura por email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1">
        <GeneralHeader>
          <Text className="text-2xl font-bold">Partilha por email</Text>
        </GeneralHeader>

        <View className="px-4 mt-4 gap-4">
          <View>
            <Feather name="file" size={30} />
          </View>

          <View className="w-full">
            <Input
              label="Email"
              placeholder="Digite o email do destinatário"
              required
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="w-full">
            <Pressable
              onPress={handleSendEmail}
              disabled={sending}
              className={`w-full p-2 ${sending ? "bg-gray-400" : "bg-primary"}`}
            >
              <Text className="text-white text-base font-semibold text-center">
                {sending ? "Enviando..." : "Enviar email"}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
