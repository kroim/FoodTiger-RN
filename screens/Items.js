import React from 'react';
import { StyleSheet, Dimensions, ScrollView,TouchableOpacity} from 'react-native';
import { Block, theme } from 'galio-framework';

import { Card } from '../components';
import Tabs from './../components/Tabs';

import config from '../config';
const { width } = Dimensions.get('screen');
import { AsyncStorage } from 'react-native';

// header for screens
import Header from "../components/Header";
import { Language } from '../constants'
import API from './../services/api'

function SelectableTabs(props){
  const { tabs, tabIndex, changeFunction } = props;
  const defaultTab = tabs && tabs[0] && tabs[0].id;
  
  if (!tabs) return null;

  return (
    <Block style={{marginTop:12}}>
      <Tabs
      style={{backgroundColor:"#F8F9FE"}}
      data={tabs || []}
      vertical={props.vertical}
      initialIndex={0}
      onChange={id => changeFunction(id)} />
    </Block>
    
  )
}

class Items extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    header: <Header back search searchPlaceholder={Language.searchInRestaurant}  options title={navigation.state.params.name} navigation={navigation} />
  });

  
  constructor(props) {
    super(props);
    this.state = {
        itemID:this.props.navigation.state.params.itemId, //The restaurant id
        items:[],
        displayList:[],
        allDisplayList:[],
        tabs:[]
    };
    this.categorizedItemsToSingleListItems = this.categorizedItemsToSingleListItems.bind(this);
    this.renderItems=this.renderItems.bind(this);
    this.getItems=this.getItems.bind(this);
    this._doSearch=this._doSearch.bind(this);
   
  }

  componentWillMount(){
    this.getItems()
  }

  componentDidMount(){
    this.props.navigation.setParams({ doSearch: this._doSearch.bind(this), name: this.props.navigation.state.params.name });
  }

  _doSearch = (text) => {
    if(text.length==0){
      //Reset search
      this.setState({
        displayList:this.state.allDisplayList
      })
    }else{
      //Do filter
      var list = JSON.parse(JSON.stringify(this.state.displayList))
      var filteredList = list
      .filter(list => (
        list.name.toLowerCase().includes(text.toLowerCase()) 
        || list.description.toLowerCase().includes(text.toLowerCase())
        || list.category_name.toLowerCase().includes(text.toLowerCase()) 
        )  )

      this.setState({
        displayList:filteredList
      })
    }
  };


  getItems(){
   var _this=this
   API.getItemsInRestaurant(this.state.itemID,(items)=>{
    _this.categorizedItemsToSingleListItems(items)
   })
  }

  /**
   * Converts the categorized to single list
   * @param {Array} items 
   */
  categorizedItemsToSingleListItems(items){
    let _this=this
    let list=[]
    var tabs=[];
    this.setState({
      displayList:[],
      allDisplayList:[]
    })
    _this=this;
    Object.keys(items).map(function (key, index) {
      
        var addedIDS=[];
        Object.keys(items[index]).map(function (key,value){
          var item=items[index][key];
          item.restaurant_id=_this.state.itemID;
          //item.category=items[index].name;
          list.push(item)

          if(addedIDS.indexOf(item.category_name) == -1)
          {  
            // element  not found
            tabs.push({id:item.category_name,title:item.category_name});
            addedIDS.push(item.category_name);
          }
        })
         

       })
      _this.setState({
          displayList:list,
          allDisplayList:list,
          tabs:tabs
      })
  }

  openDetails(item){
    this.props.navigation.navigate('Item', {item:item})
  }
 
  renderItems() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
        {
            this.state.displayList.map((item,index) =>{
           
             return(
              <TouchableOpacity key={item.id} onPress={() => {this.openDetails(item)}}>
                <Card key={item.id} item={item} horizontal from={"items"}  />
              </TouchableOpacity>
             )
            })
          }
          
        </Block>
      </ScrollView>
    )
  }

  render() {
    return (
      <Block flex center style={styles.home}>
         <SelectableTabs tabs={this.state.tabs} changeFunction={(cat_name)=>{
           this.setState({
             displayList:this.state.allDisplayList
            },() => {
              this._doSearch(cat_name);
          }) 
           
            }} tabIndex={0}   />
        {this.renderItems()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Items;
