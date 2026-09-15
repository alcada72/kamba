import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onScanned: (barcode: string) => void;
}

export function BarcodeScannerModal({ visible, onClose, onScanned }: Props) {
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
      setTorch(false);
    }
  }, [visible]);

  const handleBarcodeScanned = ({ data }: { data: string; type: string }) => {
    if (scanned) return;

    setScanned(true);

    onScanned(data);
  };

  const handleClose = () => {
    setScanned(false);
    setTorch(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {permission === null ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#DBAA68" />

            <Text style={styles.loadingText}>A verificar câmera...</Text>
          </View>
        ) : !permission.granted ? (
          <View style={styles.center}>
            <View style={styles.iconContainer}>
              <Feather name="camera-off" size={36} color="#F2F2F2" />
            </View>

            <Text style={styles.title}>Acesso à câmera</Text>

            <Text style={styles.description}>
              É necessário permitir o acesso à câmera para ler o código de
              barras.
            </Text>

            <Pressable
              onPress={requestPermission}
              style={styles.permissionButton}
            >
              <Text style={styles.permissionText}>Permitir câmera</Text>
            </Pressable>
          </View>
        ) : (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            active={visible}
            barcodeScannerSettings={{
              barcodeTypes: [
                "ean13",
                "ean8",
                "upc_a",
                "upc_e",
                "code128",
                "code39",
              ],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            enableTorch={torch}
            onMountError={(error) => {
              console.error("Erro ao iniciar câmera:", error);
            }}
          />
        )}

        {permission?.granted && (
          <View pointerEvents="none" style={styles.overlay}>
            <View style={styles.scanArea}>
              {/* TOP LEFT */}
              <View style={[styles.corner, styles.topLeft]} />

              {/* TOP RIGHT */}
              <View style={[styles.corner, styles.topRight]} />

              {/* BOTTOM LEFT */}
              <View style={[styles.corner, styles.bottomLeft]} />

              {/* BOTTOM RIGHT */}
              <View style={[styles.corner, styles.bottomRight]} />

              {!scanned && <View style={styles.scanLine} />}
            </View>

            <View style={styles.instruction}>
              <Text style={styles.instructionText}>
                Aponte a câmera para o código de barras
              </Text>
            </View>
          </View>
        )}

        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerTitle}>
            <Text style={styles.headerText}>Scanner</Text>
          </View>

          <Pressable
            onPress={() => setTorch(!torch)}
            style={styles.closeButton}
          >
            <Feather
              name={torch ? "sun" : "zap"}
              size={22}
              color={torch ? "#DBAA68" : "#FFFFFF"}
            />
          </Pressable>
        </View>

        {scanned && (
          <View style={styles.successContainer}>
            <View style={styles.successCard}>
              <View style={styles.successIcon}>
                <Feather name="check" size={22} color="#2E7D5B" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.successTitle}>Código lido</Text>

                <Text style={styles.successDescription}>
                  O código foi adicionado.
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#000000",
  },

  loadingText: {
    marginTop: 15,
    color: "#FFFFFF",
    fontSize: 15,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  title: {
    marginTop: 24,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  description: {
    marginTop: 12,
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  permissionButton: {
    marginTop: 25,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: "#DBAA68",
  },

  permissionText: {
    color: "#063023",
    fontWeight: "700",
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,

    paddingTop: 55,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(0,0,0,0.55)",
  },

  headerTitle: {
    paddingHorizontal: 18,
    paddingVertical: 9,

    borderRadius: 30,

    backgroundColor: "rgba(0,0,0,0.55)",
  },

  headerText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  headerPlaceholder: {
    width: 44,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,

    alignItems: "center",
    justifyContent: "center",
  },

  scanArea: {
    width: 320,
    height: 180,

    position: "relative",
  },

  corner: {
    position: "absolute",

    width: 35,
    height: 35,

    borderColor: "#DBAA68",
  },

  topLeft: {
    top: 0,
    left: 0,

    borderTopWidth: 3,
    borderLeftWidth: 3,
  },

  topRight: {
    top: 0,
    right: 0,

    borderTopWidth: 3,
    borderRightWidth: 3,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,

    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },

  bottomRight: {
    bottom: 0,
    right: 0,

    borderBottomWidth: 3,
    borderRightWidth: 3,
  },

  scanLine: {
    position: "absolute",

    left: 20,
    right: 20,
    top: "50%",

    height: 2,

    backgroundColor: "#DBAA68",
  },

  instruction: {
    position: "absolute",
    bottom: 100,

    paddingHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 30,

    backgroundColor: "rgba(0,0,0,0.65)",
  },

  instructionText: {
    color: "#FFFFFF",
    fontSize: 14,
  },

  successContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 30,
  },

  successCard: {
    flexDirection: "row",
    alignItems: "center",

    padding: 16,

    borderRadius: 18,

    backgroundColor: "#FFFFFF",
  },

  successIcon: {
    width: 42,
    height: 42,
    marginRight: 12,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 21,

    backgroundColor: "#DCFCE7",
  },

  successTitle: {
    color: "#063023",
    fontSize: 15,
    fontWeight: "700",
  },

  successDescription: {
    marginTop: 3,
    color: "#68736E",
    fontSize: 12,
  },
});
