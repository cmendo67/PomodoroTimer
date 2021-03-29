import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View,Button,Vibration,TextInput } from 'react-native';

export default class Main extends React.Component {

	constructor(){
		super()
		this.state={
			workTime:25,
			breakTime:5,
			workTimeSeconds:0,
			breakTimeSeconds:0,
			status:"working",
			timerRunning:false,
		}
	}

	// handles completion of timer
	handleTimerCompleted = () => {
		if(this.state.status === "working")
		{
			this.setState({
				status: "break"
			})
		}
		else
		{
			this.setState({
				status: "working"
			})	
		}
	}

	handle_Start=() =>{
		// this.setState({
		// 	status:"working"
		// })
		if(this.state.status == "working"){
			this.setState({
				status:"working"
			})
		this.timer_work = setInterval(() =>{
			if(this.state.workTimeSeconds > 0){
				this.setState({
					workTimeSeconds: this.state.workTimeSeconds - 1
				})
			}else if(this.state.workTime == 0 && this.state.workTimeSeconds == 0){
				clearInterval(this.timer_work);
				Vibration.vibrate([500,500,500]);
				this.setState({
					status:"break",
					workTime:this.state.workTime,
					workTimeSeconds:0
				})
				this.handle_Break_Time();
			}
			else if(this.state.workTime > 0 && this.state.workTimeSeconds <= 0){
				this.setState({
					workTime:this.state.workTime - 1,
					workTimeSeconds:60
				})
			}
		
		},1000)
	}else if(this.state.status == "break"){
		this.setState({
			status:"break"
		})
		this.handle_Break_Time();
	}
	}

	handle_Break_Time=() =>{
		this.setState({
			// timerRunning:true,
			status:"break"
		})
		this.timer_break = setInterval(() =>{
			if(this.state.breakTimeSeconds > 0){
				this.setState({
					breakTimeSeconds: this.state.breakTimeSeconds - 1
				})
			}
			if(this.state.breakTime > 0 && this.state.breakTimeSeconds == 0){
				this.setState({
					breakTime: this.state.breakTime - 1,
					breakTimeSeconds: 60
				})
			}	
			else if(this.state.breakTime == 0 && this.state.breakTimeSeconds == 0){
				clearInterval(this.timer_break);
				Vibration.vibrate([500,500,500]);
				// this.setState({
				// 	status: "working",
				// 	breakTime:5,
				// 	breakTimeSeconds:0,
				// 	workTime:25,
				// 	workTimeSeconds:0
				// })			
				// this.handle_Start();
				// this.update_time_status();
				this.handleReset();
				this.handle_Start();
			}
		},1000)
	}
	
	handle_Pause = () => {
		clearInterval(this.timer_work);
		clearInterval(this.timer_break);
		if(this.state.status == "working"){
			this.setState({
				timerRunning:false,
				status:"working"
			})
		}
		else if(this.state.status == "break"){
			this.setState({
				timerRunning:false,
				status:"break"
			})
		}
		return this.update_time_status();
	}	
	handleReset = () => {	
		clearInterval(this.timer_work);
		clearInterval(this.timer_break);
		this.setState({
			timerRunning: false,
			status:"working",
			workTime: 25,
			workTimeSeconds:0,
			breakTime: 5,
			breakTimeSeconds:0
		})
		return this.update_time_status();
	}	
	timerStatus = () => {
		if(this.state.status === "working")
		{
			return "Work Timer:"
		}
		else if(this.state.status === "break"){
			return "Break Timer:";	
		}
	}

	// called to set the timer's time
	update_time_status = () => {
		if(this.state.status === "working")
		{
			return <Text style={styles.textTimer}>{this.state.workTime}:{this.state.workTimeSeconds}</Text>;
		}
		else if(this.state.status == "break")
		{
			return <Text style={styles.textTimer}>{this.state.breakTime}:{this.state.breakTimeSeconds}</Text>;
		}
	}
	// gets triggered on change of worktimer text
	update_work_time = (input) =>
	{
		if(input >= 0)
		{
			this.setState({
				workTime: input
			})
		}
		else{
			alert("Time invalid. Setting value to default. Please enter valid time")
			this.setState({
				workTime: 25,
				workTimeSeconds:0
			})
		}
	}

	// gets triggered on change of worktimer text
	update_break_time = (input) =>
	{
		if(input >= 0)
		{
			this.setState({
				breakTime: input
			})
		}
		else{
			alert("Time invalid. Setting value to default. Please enter valid time")
			this.setState({
				breakTime: 5,
				breakTimeSeconds:0
			})
		}
	}
  render(){
	  let status_time = this.timerStatus();
	  	return(
        	<View style={styles.container}>
           		 <Text style={styles.textStyle1}> Pomodoro Timer </Text>
            
				<Text style={styles.textTimer}>{status_time}  {this.update_time_status()} </Text>			
				<View style={styles.textContainer}>
					<Text style={styles.textStyle}>  Work Time: Mins</Text>
					<Text style={styles.textStyle}>       Break Time: Mins</Text>
				</View>
				<View style={styles.textInputContainer}>
       			 	<TextInput  style={styles.input}  keyboardType={"numeric"} 
      			 	  defaultValue={''+this.state.workTime} onChangeText={this.update_work_time} />

       			 	<TextInput  style={styles.input}  keyboardType={"numeric"} 
       			 	defaultValue={''+this.state.breakTime} onChangeText={this.update_break_time}/>
				</View>
				<View style ={styles.buttoncontainer}>
            		<Button color="blue" onPress={this.handle_Start} title="Start"></Button>
            		<Button color="blue" onPress={this.handle_Pause} title="Pause"></Button>
            		<Button color="blue" onPress={this.handleReset} title="Reset"></Button>
            	</View>
			</View>
			
			);
		}
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'red',
    },
	buttoncontainer:{
		marginTop:50,
		flexDirection:"row",
		justifyContent: 'space-evenly',
		alignItems:'center'
	  },
	  textContainer:{
		flexDirection:"row",
		alignItems:'center'
	  },
	  textInputContainer:{
		
		flexDirection:"row",
		justifyContent: 'space-evenly',
		alignItems:'center'
	  },
	  textStyle:{
		color: "white",
		fontSize:22,
		marginTop: 50,

	  },
	  textStyle1: {
        color: "white",
        fontSize: 28,
        marginTop: 45,
		left:85
      },
    textStyle2: {
        color: "white",
        fontSize: 28,
        marginTop: 45,
      },
	  textColor:{
		color: "white",
	  },
	  textTimer:{
		color:"white",
		fontSize:35,
		left:60
	  },
      headerImage:{
        width:40,
        height:40,
        left:240,
        top:-35
      },
	  input: {
		borderWidth: 5,
		borderColor: 'black',
		paddingHorizontal: 80,		
	  },
  });