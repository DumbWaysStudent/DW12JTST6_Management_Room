import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView} from 'react-native';
import { Button, Icon, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Logo from '../components/Logo';
import AuthService from '../AuthService';
import { connect } from 'react-redux';
import * as actionUsers from './../redux/actions/actionUsers';
import AnimatedLoader from 'react-native-animated-loader';

class LoginScreen extends Component {
    constructor(){
        super();
        this.state ={
            email:'',
            validate_email : false,
            password:'',
            isSecureTextEntry:false,
            // fixEmail: 'irvan@gmail.com',
            // fixPassword : 'irvan',
            loading:false,
            visible:false
        }
    }

    async componentDidMount(){
        if(await (new AuthService).exist()){
            this.props.navigation.navigate('Room')
        }
    }

    checkEmail = () =>{
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(this.state.email) === false) {
            alert("Email is Not Correct");
            this.setState({validate_email:false})
            return false;
        }
        else {
            this.setState({validate_email:true})
            this.checkLogin()
        }
    }
    checkLogin = async() =>{
        const data = {
            email :this.state.email,
            password: this.state.password
        }
        this.setState({
            visible: !this.state.visible,      
        });  
        await this.props.authLogin(data)
        const login = this.props.authDataLocal.users
        // console.log("INI LOGIN :", login)
        if(login.error==true){
            this.loading()
            alert(JSON.stringify(login.message))
        }else{
            const auth = new (AuthService)
            await auth.save(login)
            this.props.navigation.navigate('Room')
            this.loading()
        }
    }
    showPassword=()=>{
        this.setState({
            isSecureTextEntry: !this.state.isSecureTextEntry
        })
    }
    loading = () => {
        setTimeout(() => {
            this.setState({
                visible: !this.state.visible,      
            });    
        }, 1000);  
    };
    render(){
        const { visible } = this.state;
        return (   
            <KeyboardAvoidingView style={styles.container} behavior="height" enabled>
                <AnimatedLoader 
                    visible={visible} 
                    overlayColor="rgba(255,255,255,0.75)" 
                    animationStyle={styles.lottie} 
                    speed={1} 
                />
                <Logo/>
                <View style={styles.form}>
                    <TextInput
                        style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        autoCapitalize="none"
                        placeholder="Email"
                        placeholderTextColor="#ffffff"
                        selectionColor="#fff"
                        keyboardType="email-address"
                        value={this.state.email}
                        onChangeText = {(text)=>{
                            this.setState({
                                email:text
                            })
                        }}
                    />
                    <TextInput 
                        autoCapitalize="none"
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Password"
                        placeholderTextColor="#ffffff"
                        selectionColor="#fff"
                        value={this.state.password}
                        secureTextEntry={!this.state.isSecureTextEntry}
                        onChangeText={(text)=>{
                            this.setState({
                                password:text
                            })
                        }}
                    >
                    </TextInput>
                    {/* <TouchableOpacity onPress={this.showPassword}>
                        <Icon 
                            style={{marginTop:15, fontSize:33, paddingHorizontal:5, borderRadius:5}}
                            name={this.state.isSecureTextEntry ? 'eye': 'eye'}></Icon>
                    </TouchableOpacity> */}
                    
                    <Button block info style={styles.button} onPress={()=> this.checkEmail()}>
                        <Text style={{justifyContent:'center', color:'white'}}>Login</Text>
                    </Button>

                </View>
                <View style={styles.signupTextCont}>
                    <Text style={styles.signupText}>Dont have an account yet?</Text>
                    <TouchableOpacity onPress={()=> this.props.navigation.navigate("Register")}>
                        <Text style={styles.signupButton}> Signup</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container : {        
        backgroundColor:'#f1f2f6',
        flex: 1,
        alignItems:'center',
        // justifyContent :'center'
    },
    lottie: {
        width: 100,    
        height: 100,  
    },
    form : {
        // marginTop:-50,
        flexGrow: 1,
        // justifyContent:'center',
        alignItems: 'center'
    },
    inputBox: {
        width:300,
        height:50,
        backgroundColor:'#eccc68',
        borderRadius: 25,
        paddingHorizontal:16,
        fontSize:16,
        color:'#ffffff',
        marginVertical: 10
    },
    button: {
        width:300,
        backgroundColor:'#d35400',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
        textAlign:'center'
    },
    signupTextCont : {
        flexGrow: 1,
        alignItems:'flex-end',
        justifyContent :'center',
        paddingVertical:16,
        flexDirection:'row'
    },
    signupText: {
        color:'#7f8c8d',
        fontSize:16
    },
    signupButton: {
        color:'#2c3e50',
        fontSize:16,
        fontWeight:'500'
    }
})

const mapStateToProps = state => {
    return {
        authDataLocal: state.Users
    }
  }
  const mapDispatchToProps = dispatch => {
    return {
      authLogin: (data) => dispatch(actionUsers.handleLogin(data)),
    }
  }
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginScreen)