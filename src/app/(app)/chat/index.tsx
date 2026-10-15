import { Screen } from '@/components/ui/Screen'
import { TypingIndicator } from '@/components/ui/TypingIndicator'
import { colors } from '@/constants/theme'
import { useChat } from '@/hooks/chat/useChat'
import { useHeaderHeight } from 'expo-router/react-navigation'
import { useMemo, useState } from 'react'
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
  const { messages, sendMessage, isSending, isLoading, isLoadingMoreMessages, loadMoreMessages } =
    useChat()
  const [inputText, setInputText] = useState('')

  const invertedMessages = useMemo(() => [...(messages || [])].reverse(), [messages])
  const isButtonDisabled = isSending || inputText.length === 0 || isLoading

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
          {isLoading ? (
            <ActivityIndicator style={{ margin: 'auto' }} size={'large'} color={colors.primary} />
          ) : (
            <FlatList
              data={invertedMessages}
              inverted
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={
                isLoadingMoreMessages ? (
                  <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : null
              }
              onMomentumScrollBegin={loadMoreMessages}
              renderItem={({ item }) => {
                const isUser = item.role === 'user'
                if (item.text.length === 0)
                  return isSending ? (
                    <View style={[styles.bubble, styles.assistantBubble]}>
                      <TypingIndicator />
                    </View>
                  ) : null
                return (
                  <View
                    style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}
                  >
                    <Text style={isUser ? styles.userText : styles.assistantText}>
                      {item.text.replace(/\\n/g, '\n')}
                    </Text>
                  </View>
                )
              }}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Escribí tu mensaje..."
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: isButtonDisabled ? colors.borderAccent : '#2e7d32' },
            ]}
            onPress={handleSend}
            disabled={isButtonDisabled}
          >
            <Text
              style={[
                styles.sendButtonText,
                { color: isButtonDisabled ? colors.background : '#fff' },
              ]}
            >
              Enviar
            </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  sendButtonText: { fontWeight: 'bold' },
})
