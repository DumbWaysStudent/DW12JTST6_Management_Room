import React, { Component } from 'react';
import { 
  Text, 
  Image, 
  StyleSheet, 
  StatusBar, 
  ActivityIndicator,
  Clipboard,
  Share,
} from 'react-native';
import { Container, Header, View, Button, Icon, Left, Body } from 'native-base';
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import URL from '../../ENV_URL';
import AuthService from '../AuthService';
import Axios from 'axios';
import AnimatedLoader from 'react-native-animated-loader';

import uuid from 'uuid';
import * as firebase from 'firebase';

console.disableYellowBox = true;


firebaseConfig = {
  apiKey: 'AIzaSyBNjJt99CMRWO-3SqnI24f-UuyP2oy8P-w',
  authDomain: 'https://hotelq-66b4c.firebaseio.com',
  databaseURL: 'https://hotelq-66b4c.firebaseio.com/',
  storageBucket: 'gs://hotelq-66b4c.appspot.com/',
  messagingSenderId: '308541070517',
}
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export default class CustomersAddScreen extends Component {
  constructor() {
    super()
    this.state = {
      customerData: '',
      visible:false,
      image: null,
      uploading:false,
      data :{
        name: "" ,
        identity_number: "",
        phone_number: "",
      }
      
    };
  }
  async componentDidMount() {
    const { dataEdit } = this.props.navigation.state.params
    this.setState({customerData: dataEdit, image:dataEdit.image,
        data:{...this.state.data, name: dataEdit.name, identity_number:dataEdit.identity_number, phone_number: dataEdit.phone_number}})
    // this.getPermissionAsync();
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  // getPermissionAsync = async () => {
  //   if (Constants.platform.ios) {
  //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //     if (status !== 'granted') {
  //       alert('Sorry, we need camera roll permissions to make this work!');
  //     }
  //   }
  // }

  
  
  editCustomer = async () => {
    const token = await (new AuthService).fetch('token')
    const data ={
        name:this.state.data.name,
        identity_number:this.state.data.identity_number,
        phone_number:this.state.data.phone_number,
        image:this.state.image
    }
    const id = this.state.customerData.id
    this.setState({
      visible: !this.state.visible,      
    }); 
    await Axios({
        method: "PATCH",
        headers: {
            'content-type': 'application/json',
            'authorization': token
        },
        data,
        url: `${URL.apiUrl}/customer/${id}`
    })
    setTimeout(()=>{
        this.props.navigation.navigate('Customer')
        this.setState({
          visible: !this.state.visible,      
        }); 
    },2000)
  }
  render() {
    let { image } = this.state
    const { visible } = this.state;    
    return (  
      <Container style={{backgroundColor:'#455a64'}}>
        <AnimatedLoader 
          visible={visible} 
          overlayColor="rgba(255,255,255,0.75)" 
          animationStyle={styles.lottie} 
          speed={1} 
        />
        <StatusBar barStyle="dark-content" />
        <Header style={{marginTop:20, backgroundColor:'#e67e22'}}>
        <Left>
            <Button transparent onPress={()=> this.props.navigation.goBack()} style={{ alignItems:'center'}}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>Edit Customer</Text>
          </Body>
        </Header>
        <View style={{flex:1, alignItems:'center', marginTop:20}}>
          <View style={styles.form}>
            <TextInput 
              placeholder='Name'
              style={styles.inputBox}              
              value={this.state.data.name}
              onChangeText= {(text)=>{
                this.setState({
                    data:{...this.state.data, name:text}
                })
              }}/>
            <TextInput 
              keyboardType={'numeric'}
              placeholder='Identity Number'
              style={styles.inputBox}
              value={this.state.data.identity_number}
              onChangeText= {(text)=>{
                this.setState({
                    data:{...this.state.data, identity_number:text}
                })
              }}/>
            <TextInput 
              keyboardType={'numeric'}
              placeholder='Phone Number'
              style={styles.inputBox}
              value={this.state.data.phone_number}
              onChangeText= {(text)=>{
                this.setState({
                    data:{...this.state.data, phone_number:text}
                })
              }}/>
            <View style={{ alignItems: 'center', justifyContent: 'center'}}>
              {image ? null : (
                <Text
                  style={{
                    color:'#000000',
                    fontSize: 20,
                    marginBottom: 20,
                    textAlign: 'center',
                    marginHorizontal: 15,
                  }}>
                  Upload your image
                </Text>
              )}
              <View style={{flexDirection:'row'}}>
                <Button 
                  style={{width:53,height:53, marginRight:10}}
                  rounded danger
                  onPress={ this._pickImage }>
                  <Icon name="photos"></Icon>
                </Button>
                <Button 
                  style={{width:53,height:53}}
                  rounded danger
                  onPress={ this._takePhoto }>
                  <Icon name="camera"></Icon>
                </Button>
              </View>
                {this._maybeRenderImage()}
                {this._maybeRenderUploadingOverlay()}
            </View>
            <Button block success onPress={()=> this.editCustomer() }>
              <Text style={{fontWeight:'bold', color: 'white', marginTop:10}}>Update</Text>
            </Button>
          </View>
        </View>
      </Container>
    );
  }
  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };
  
  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }
  
    return (
      <View
        style={{
          marginTop: 10,
          width: 170,
          borderRadius: 3,
          elevation: 2,
        }}>
        <View
          style={{
            borderRadius:3,
            overflow: 'hidden',
            color:'#ffffff',
            marginBottom:10,
          }}>
          <Image source={{ uri: image }} style={{ width: 170, height: 170 }} />
        </View>
      </View>
    );
  };
  
  _share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.data.image,
    });
  };
  
  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert('Copied image URL to clipboard');
  };
  
  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
  
    this._handleImagePicked(pickerResult);
  };
  
  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
  
    this._handleImagePicked(pickerResult);
  };
  
  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });
  
      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };
}
  
async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
  form:{
    backgroundColor:"#f1f2f6", 
    padding:10, 
    borderRadius:7, 
    width:'90%',
    borderColor:'#e67e22',

  },
  inputBox:{
    fontSize:16, 
    height:43, 
    borderWidth:1, 
    paddingHorizontal:10, 
    margin:5, 
    borderRadius:5, 
    color:"#000", 
    borderColor:"#e67e22"
  },
  lottie: {
    width: 100,    
    height: 100,  
  },
})