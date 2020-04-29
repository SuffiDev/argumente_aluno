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

function Item({ title, id, navigate }) {
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
        }}onPress={() => Alert.alert( 'Redação','O que deseja fazer?',[
            {text: 'Visualizar correção', onPress: () => navigate.editarRedacao(id)},
            {text: 'Excluir', onPress:() => navigate.excluirRedacao(id)}])}>
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
    editarRedacao = async (id) => {
        console.log('id' + id)
        this.props.navigation.navigate('DetalhesRedacao',{'id':id})
    }
    excluirRedacao = async (id) => {
        try {
            await axios.post('http://178.128.148.63:3000/deletaRedacao',{  
                    id:id 
                }, (err, data) => {
                }).then(data => {
                    console.log(data.data['desc'])
                    if(data.data['status'] == 'ok'){
                        Alert.alert( 'Excluir Redação','Excluido com sucesso!',[{text: 'OK', onPress: () => {}}])
                        this.getRedacoes()
                    }
                    
                })
        } catch (error) {
            console.log(error)
        // Error saving data
        }
    }
    componentDidMount () {
        this._onFocusListener = this.props.navigation.addListener('didFocus', (payload) => {
          this.getRedacoes();
        });
    }
    handleBackButtonClick() {
        this.props.navigation.navigate('Index')
        return true;
    }
    getRedacoes = async () => {
        try {
            this.atualizaStatus()
            const idAluno = await AsyncStorage.getItem('@idAluno')
            let idAlunoInt = parseInt( idAluno.replace(/^"|"$/g, ""))
            await axios.post('http://178.128.148.63:3000/get_redacao',{                   
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
                        listItems.push({id: currentItem['idRedacao'], title: currentItem['tema']})
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
                    <View style={styles.iconHeader}>
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
                        renderItem={({ item }) => <Item style={{borderWidth: 1}}title={item.title} id={item.id} navigate={this} />}
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
    iconHeader:{ // Style do Icone que fica no start do Header
        justifyContent: 'flex-start',
        position: 'absolute',
        left:0,
        marginLeft:15
        
    },

})