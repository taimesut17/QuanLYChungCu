import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    text: {
        fontSize: 16, fontWeight: "bold", marginBottom: 4
    },
    textFlex:{
        fontSize: 16, fontWeight: "bold", marginBottom: 4,display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20
    }
})
