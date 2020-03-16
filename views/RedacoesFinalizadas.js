import React, {Component, Fragment} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import ModalDropdown from 'react-native-modal-dropdown'
import {
        View,
        Text, 
        StyleSheet,
        TouchableOpacity,
        Alert,
        ToastAndroid,
        FlatList
    } from 'react-native'
const initialState = {registros: [],abriu: true}

function Item({ title, id }) {
    return (
        <View >
            <TouchableOpacity style={{        
            borderColor:'#0066CC',
            borderWidth:1,
            width:'100%',
            marginTop: 10,
            flexDirection:"row",
            alignItems: 'center',
            justifyContent: 'center',
            height: 40
        }}>
                <Icon style={styles.iconStart} name="check" size={30} color='black' />
                <Text style={{
                    color: 'black',
                    fontSize: 20
                }}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
    }
export default class Register extends Component {
    state = {
        ...initialState
    }
    atualizaStatus = () => {
        this.setState({abriu:false})
    }
    getRedacoes = async () => {
        try {
            this.atualizaStatus()
            const idAluno = await AsyncStorage.getItem('@idAluno')
            let idAlunoInt = parseInt( idAluno.replace(/^"|"$/g, ""))
            await axios.post('http://192.168.0.22:3000/get_redacao',{                   
                    idAluno: idAlunoInt,              
                    tipoRedacao: 'finalizada'
                }, (err, data) => {
                    console.log(err)
                    console.log(data)
                }).then(data => {
                    let listItems = []
                    let currentItem
                    console.log(data.data['desc'])
                    for(let i =0; i< data.data['desc'].length; i++){
                        currentItem = data.data['desc'][i]
                        listItems.push({id: currentItem['id'], title: currentItem['tema']})
                    }
                    console.log(JSON.stringify(listItems))
                    this.setState({registros:listItems})
                    
                })
        } catch (error) {
            console.log(error)
        // Error saving data
        }
    }
    
    render() {
        if(this.state.abriu){
            this.getRedacoes()
        }
        return(
            <View style={styles.content} >  
                <View style={styles.header}>
                    <View style={styles.iconStart}>
                        <TouchableOpacity  onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name="bars" size={30} color='#FFF'  /> 
                        </TouchableOpacity>
                    </View>
                    <View >
                        <Text style={styles.contentTextHeader} >REDAÇÕES FINALIZADAS</Text>
                    </View>

                </View>

                <View  style={styles.paddingTop}></View>
                <View style={{
                    marginLeft: 20,
                    marginRight: 20
                }}>
                    <FlatList
                        data={this.state.registros}
                        renderItem={({ item }) => <Item style={{borderWidth: 1}}title={item.title} id={item.id} />}
                        keyExtractor={item => item.id}
                    />
                </View>
                
            </View>        
        )
    }
}

const styles = StyleSheet.create({
    
    content:{ //Style do content da pagina
        flex:1,
        width: '100%',
        height: '100%'
    },
    header:{ // Style do Header geral
        backgroundColor:'#0066CC',
        width:'100%',
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center',
        height:60
    },
    iconStart:{ // Style do Icone que fica no start do Header
        justifyContent: 'flex-start',
        position: 'absolute',
        left:0,
        marginLeft:5
        
    },

})