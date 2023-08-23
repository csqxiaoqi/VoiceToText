import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
// import {Recognizer} from '../components/react-native-speech-iflytek';
import {
  Recognizer,
  Synthesizer,
  SpeechConstant,
} from 'react-native-speech-iflytek';
import {NativeEventEmitter} from 'react-native';
//import LottieView from 'lottie-react-native';
const VoiceTest = props => {
  const [text, setText] = useState('');
  const [isLoading, setLoading] = useState(false);
  const recognizerEventEmitter = new NativeEventEmitter(Recognizer);

  useEffect(() => {
    // Recognizer.init('9ab33da4'); // 替换成你的 AppID
    const onRecognizerResult = e => {
      if (!e.isLast) {
        return;
      }
      const newMessage = {
        _id: Math.random().toString(), // 使用随机生成的 ID
        text: e.result,
        createdAt: new Date(),
        user: {
          _id: 1, // 发送者的 ID
          name: 'User Name', // 发送者的名称
        },
      };
      props.onChildClick(newMessage); // 传递一个带有 _id 和 text 的对象
      setText(e.result);
      setLoading(false);
    };

    recognizerEventEmitter.addListener(
      'onRecognizerResult',
      onRecognizerResult,
    );

    return () => {
      recognizerEventEmitter.removeListener(
        'onRecognizerResult',
        onRecognizerResult,
      );
    };
  }, []);

  const startRecording = () => {
    setLoading(true);
    Recognizer.start();
  };

  const stopRecording = () => {
    setLoading(false);
    Recognizer.stop();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={isLoading ? stopRecording : startRecording}>
        {/* <LottieView
          source={require('../images/anm/Animation - 1692167067225.json')} // 用于播放话筒动画的 Lottie JSON 文件
          autoPlay
          loop
          style={{width: 80, height: 80}}
        /> */}
        <Image
          source={require('../images/iflytek/voice_empty.png')}
          style={{width: 30, height: 15, borderRadius: 20}}></Image>
        <Text>{isLoading ? '停止' : '开始'}</Text>
      </TouchableOpacity>
      {/* {isLoading && <ActivityIndicator size="large" color="black" />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -10,
    zIndex: 9999,
    marginLeft: 10,
    marginTop: -30,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  resultText: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default VoiceTest;
