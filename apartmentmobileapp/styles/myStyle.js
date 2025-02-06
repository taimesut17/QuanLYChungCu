import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',

    }, subject: {
        fontSize: 30,
        color: "blue",
        textAlign: "center",
        padding: 10
    },card: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    flex: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5
    },
    paddingNavigator:{
        paddingEnd: 10
    }
})