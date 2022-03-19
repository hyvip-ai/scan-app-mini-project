import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";

function capitalize(arr) {
  arr.forEach((item, index) => {
    arr[index] = item.charAt(0).toUpperCase() + item.slice(1);
  });
  return arr;
}
const calculateTotalCost = (arr) => {
  return arr.reduce((acc, item) => {
    return (acc += Number(item[item.length - 1]));
  }, 0);
};
export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState([]);
  const [currentScanned, setCurrentScanned] = useState(
    "Your Last Scan Will Appear Here"
  );
  const [showResult, setShowResult] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  useEffect(() => {
    if (currentScanned !== "Your Last Scan Will Appear Here") {
      setScannedData((prev) => [...prev, currentScanned]);
    }
  }, [currentScanned]);
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setCurrentScanned(data);
    alert(`Bar code with data: ${data} has been scanned!`);
  };
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (showResult) {
    const scannedResult = scannedData.map((item) => JSON.parse(item));
    const resultHead = capitalize(Object.keys(scannedResult[0]));
    const resultData = scannedResult.map((item) => Object.values(item));
    const totalCost = calculateTotalCost(resultData);
    return (
      <>
        <View style={styles.tableContainer}>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              data={resultHead}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={resultData} textStyle={styles.text} />
          </Table>
        </View>
        <Text style={styles.mainText}>Total Cost : {totalCost}</Text>
        <Button
          title="Start Scanning Again"
          onPress={() => {
            setShowResult(false);
            setScanned(false);
            setCurrentScanned("Your Last Scan Will Appear Here");
            setScannedData([]);
          }}
        />
      </>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />
      </View>
      <View>
        <Text style={styles.mainText}>Last Scanned : {currentScanned}</Text>
      </View>
      <View>
        {scanned ? (
          <View>
            <Button
              onPress={() => setScanned(false)}
              title="Continue Scanning"
              color="tomato"
            />
            <View style={styles.separator}></View>
            <Button
              onPress={() => setShowResult(true)}
              title="Generate Result ...."
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
  },
  mainText: {
    fontSize: 16,
    margin: 20,
    textAlign: "center",
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  tableContainer: {
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  button: {
    marginBottom: 15,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
