import React from 'react';
import { View, TextInput, StyleSheet, Text, Dimensions } from 'react-native';

type CravvInputFieldProps ={
    label :string,
    onChangeText : (text:string)=>void,
    password? : boolean
}

export default function CravvInputField({label,onChangeText,password=false}:CravvInputFieldProps) {
  return (
     <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        placeholder={label}
        onChangeText={onChangeText}
    secureTextEntry={password}
    autoCapitalize='none'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  input: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1.5,
    borderColor: '#ddd',
    width:Dimensions.get('screen').width - 50
  },
});