
import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e8e8',
        display: 'flex',
    
    },
    topBackground: {
        flex: 8,
        backgroundColor: '#e8e8e8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    bottomBackground: {
        flex: 3,
        backgroundColor: '#ef4136',
    },
    formLogin: {
        marginTop: 10,
        backgroundColor: '#ffffff',
        position: 'absolute',
        borderRadius: 10,
        zIndex: 100,
        width: 300,
        height: 300,
        padding: 20,
        top: '50%',
        left:'50%',
        transform: [{translateX: '-50%'}],
        shadowColor: 'rgba(99, 99, 99, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    cardView: {
        flex: 2,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: '#ef4136',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCardView: {
        color: 'white',
        fontSize: 30,
        fontWeight: '600',
        maxWidth: 300
    },
    registerForm: {
        flex: 7,
        backgroundColor: '#e8e8e8',
        padding: 40,
        display: "flex",
        gap: 10,
    },
    input:{
        borderRadius: 50,
        color: 'black',
        gap: 5
    },avatar:{
        height:100,
        width:100
    },
    button: {
        backgroundColor: '#e8e8e8',
        borderRadius:15
    },
    errorLabel: {
        marginTop: -10
    }
})

