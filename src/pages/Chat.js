/* eslint-disable prettier/prettier */
import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
// 引入中文语言包
import 'dayjs/locale/zh-cn';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
  Platform,
  SafeAreaView,
  Image,
  KeyboardEvent,
  ImageBackground,
  StatusBar,
} from 'react-native';
import AudioExample from './Audio';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import VoiceTest from './VocieTest';
import axios from 'axios';
export default function Example() {
  const [messages, setMessages] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardshow, setkeyboardshow] = useState(false);
  useEffect(() => {
    //添加监听监听键盘高度·
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', e => {
      setkeyboardshow(true);
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setkeyboardshow(false);
      },
    );
    // setStatusHeigh(StatusBar.currentHeight);
    setMessages([
      {
        _id: 1,
        text: '这是一个快速回复',
        createdAt: new Date(),
        quickReplies: {
          type: 'radio', // or 'checkbox',
          keepIt: true,
          values: [
            {
              title: '😋 Yes',
              value: 'yes',
            },
            {
              title: '📷 Yes, let me show you with a picture!',
              value: 'yes_picture',
            },
            {
              title: '😞 Nope. What?',
              value: 'no',
            },
          ],
        },
        user: {
          _id: 2,
          name: '儿子',
          avatar: 'https://placeimg.com/100/100/any',
        },
      },
      {
        _id: 2,
        text: '这是一个快速回复',
        createdAt: new Date(),
        quickReplies: {
          type: 'checkbox', // or 'radio',
          values: [
            {
              title: 'Yes',
              value: 'yes',
            },
            {
              title: 'Yes, let me show you with a picture!',
              value: 'yes_picture',
            },
            {
              title: 'Nope. What?',
              value: 'no',
            },
          ],
        },
        user: {
          _id: 1,
          name: '小孔',
          avatar: 'https://placeimg.com/100/100/animals',
        },
      },
    ]);

    //移除监听
    return () => {
      keyboardShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  //发送消息
  const onSend = useCallback((msg = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, msg));
    msg !== undefined ? getChatGpt(msg[0].text) : '';
  }, []);
  //自定义气泡
  const renderBubble = props => {
    return (
      <View style={{marginBottom: 40}}>
        <Bubble
          {...props}
          textStyle={{
            right: {
              color: 'black',
            },
          }}
          wrapperStyle={{
            right: {
              backgroundColor: '#95ec69',
            },
            alignSelf: 'stretch',
            marginBottom: 40, // 调整气泡的底部间距
          }}
          containerStyle={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </View>
    );
  };
  //发送按钮
  const renderSend = props => {
    return (
      <Send {...props} containerStyle={{borderTopWidth: 0}}>
        <View
          style={{
            width: 80,
            height: 40,
            marginLeft: 40,
          }}>
          <Text
            style={{
              color: '#0366d6',
              fontSize: 20,
            }}>
            发送
          </Text>
        </View>
      </Send>
    );
  };

  //自定义头像
  const CustomAvatar = props => {
    const {currentMessage} = props;
    return (
      <View style={{marginRight: 8, marginBottom: 40}}>
        <Image
          source={{uri: currentMessage.user.avatar}} //根据具体id来拿user的图片
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#DAA520',
          }}></Image>
      </View>
    );
  };
  // 回调函数，接收子组件传递的值
  const handleChildClick = message => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, message),
    );
    message !== undefined ? getChatGpt(message.text) : '';
  };

  //调用chatgpt接口完成自动回复
  const getChatGpt = msg => {
    if (!msg) {
      alert('请输入内容');
      return;
    }

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: [{content: msg, role: 'user'}],
    };

    axios
      .post('https://mrdong.com.cn/v1/chat/completions', requestData, {
        headers: {
          Authorization:
            'Bearer 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',
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        const responseText = res.data.choices[0].message.content;
        const newMessage = {
          _id: Math.random().toString(),
          text: responseText,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
          },
        };

        // 使用 setMessages 更新消息列表
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessage),
        );
      })
      .catch(error => {
        if (error.message == 'Request failed with status code 429') {
          const newMessage = {
            _id: Math.random().toString(), // 使用随机生成的 ID
            text: '请求太频繁了，请让我休息一下，稍后在发送哦！！',
            createdAt: new Date(),
            user: {
              _id: 1, // 发送者的 ID
              name: 'User Name', // 发送者的名称
            },
          };
          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, newMessage),
          );
        }
      });
  };

  //底部输入框自定义样式
  const renderInputToolbar = props => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <AudioExample
          style={{marginRight: 8}}
          onChildClick={handleChildClick}
        />
        <InputToolbar
          {...props}
          containerStyle={{
            flex: 1, // 让输入框占据剩余空间
            backgroundColor: '#f0f0f0',
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            paddingHorizontal: 8,
            marginLeft: 50,
            marginRight: 10,
            marginBottom: 10,
          }}
          primaryStyle={{
            flexDirection: 'row', // 水平布局
            alignItems: 'center', // 垂直居中
          }}
        />
      </View>
    );
  };
  const backgroundImageUrl =
    '../images/chat/dcef4e6d67d6c7ffaf23e9b993066f09.jpg';
  //页面渲染
  return (
    <SafeAreaView>
      <ImageBackground
        source={{uri: backgroundImageUrl}}
        style={{
          height: keyboardshow
            ? Dimensions.get('window').height - 30 - keyboardHeight
            : Dimensions.get('window').height - 30,
          backgroundColor: '#FFC0CB',
        }}>
        <GiftedChat
          messages={messages}
          user={{
            _id: 1,
          }}
          onSend={messages => onSend(messages)}
          showUserAvatar={true}
          locale={'zh-cn'}
          renderAvatar={props => <CustomAvatar {...props}></CustomAvatar>}
          showAvatarForEveryMessage={true}
          bottomOffset={20}
          renderBubble={renderBubble}
          placeholder={'开始聊天吧'}
          renderUsernameOnMessage={true}
          renderSend={renderSend}
          isKeyboardInternallyHandled={true}
          isAnimated={true}
          isLoadingEarlier={true}
          keyboardShouldPersistTaps="handled" //点击事件会使键盘消失
          isTyping={true} //三个动态点
          // text="我通过了"
          renderInputToolbar={renderInputToolbar}
          style={{backgroundColor: 'red'}}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
