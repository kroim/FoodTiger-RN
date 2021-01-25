import React from 'react';
import { StyleSheet, Dimensions, ScrollView,TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import { Block, theme } from 'galio-framework';


import { Card } from '../components';
const { width } = Dimensions.get('screen');
import { AsyncStorage } from 'react-native';

// header for screens
import Header from "../components/Header";
import { Language } from '../constants'
import API from './../services/api'

class Items extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    header: <Header search searchPlaceholder={Language.searchRestaurants}  options title={Language.Restaurant} navigation={navigation} />
  });

  constructor(props) {
    super(props);
    this.state = {
        restaurants:[],
        allRestaurants:[],
        
    };
    this.getRestaurants = this.getRestaurants.bind(this);
   
  }

  componentDidMount(){
   this.getRestaurants();
   this.openDetails=this.openDetails.bind(this);
   this.props.navigation.setParams({ doSearch: this._doSearch.bind(this) });
  }

  _doSearch = (text) => {
    if(text.length==0){
      //Reset search
      this.setState({
        restaurants:this.state.allRestaurants
      })
    }else{
      //Do filter
      var list = JSON.parse(JSON.stringify(this.state.allRestaurants))
      var filteredList = list
      .filter(list => (list.name.toLowerCase().includes(text.toLowerCase()) || list.description.toLowerCase().includes(text.toLowerCase()) )  )

      this.setState({
        restaurants:filteredList
      })
    }
  };

  
  getRestaurants() {
     let _this=this
     API.getRestaurants((restaurants)=>{
        _this.setState({
          restaurants:restaurants,
          allRestaurants:restaurants
        })
     })
  }

  openDetails(restaurant){
    this.props.navigation.navigate('Items', {itemId:restaurant.id, name:restaurant.name})
  }

  renderItems = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
          {
            this.state.restaurants.map((item)=>{
              return (
                <TouchableOpacity  key={item.id}  onPress={()=>{this.openDetails(item)}}>
                    <Card key={item.id} item={item} horizontal  />
                </TouchableOpacity>)
            })
          }
          
        </Block>
      </ScrollView>
    )
  }

  render() {
    return (
      <Block flex center style={styles.home}>
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
