// app/chat.tsx
import { Screen } from '@/components/ui/Screen'
import { useChat } from '@/hooks/chat/useChat'
import { useHeaderHeight } from 'expo-router/react-navigation'
import { useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

export default function ChatScreen() {
  const headerHeight = useHeaderHeight()
  const { messages, sendMessage, isSending } = useChat()

  const [inputText, setInputText] = useState('')
  const flatListRef = useRef<FlatList>(null)

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return

    const textToSend = inputText.trim()
    setInputText('')

    try {
      await sendMessage(textToSend)
    } catch (error) {
      console.error('Error enviando mensaje:', error)
    }
  }

  return (
    <Screen style={[styles.container, { paddingHorizontal: 0 }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
      >
        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            renderItem={({ item }) => {
              const isUser = item.role === 'user'
              return (
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
                  <Text style={isUser ? styles.userText : styles.assistantText}>{item.text}</Text>
                </View>
              )
            }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        </View>
        {isSending && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" />
            <Text style={styles.loadingText}>Pensando...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Escribí tu mensaje..."
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={isSending || inputText.length === 0}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageList: { padding: 16 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginVertical: 6 },
  userBubble: { backgroundColor: '#2e7d32', alignSelf: 'flex-end' },
  assistantBubble: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  userText: { color: '#fff' },
  assistantText: { color: '#000' },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  loadingText: { marginLeft: 8, fontStyle: 'italic', color: '#666' },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#2e7d32',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
})
