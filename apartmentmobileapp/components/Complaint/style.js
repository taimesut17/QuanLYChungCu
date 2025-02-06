import { StyleSheet } from "react-native";

export default StyleSheet.create({
    borderBottom: {
        borderBottomWidth: 1, 
        borderBottomColor: '#eceff1', 
        borderWidth: 0,
        padding: 4
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    
    },
    viewFlex: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5, 
        width: '100%',
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        paddingStart: 3
    }
})
