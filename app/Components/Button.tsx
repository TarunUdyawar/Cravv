import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {Colors} from "../Data/Colors";

type buttonProps ={
    title : string,
    onPress : ()=>void,
    loading? : boolean
}

export default function Button({title,onPress,loading=false}:buttonProps) {
  return (
   <TouchableOpacity onPress={onPress} style={[styles.button]}>
    {loading ?<ActivityIndicator size={'small'} color={'white'}/>:<Text style={styles.text}> {title} </Text> }
   
   </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    // shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    margin: 90
  },
  text: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
})