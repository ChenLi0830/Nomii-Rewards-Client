import React, {Component} from 'react';
import {StyleSheet, ListView, Dimensions, View, TouchableOpacity} from 'react-native';
import Card from './common/Card';
import {connect} from 'react-redux';
import {homeActions} from '../modules';

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  list: {
    marginTop: 74,
    flex: 1,
    
    paddingTop: 10,
    paddingBottom: height * 0.15,
  }
});

class CardList extends Component {
  constructor(props) {
    super(props);
    const cardContentList = [
      {
        name: "Poké Bar SFU",
        distance: 128,
        logo: require("../../public/images/temp/Poke_Bar_Social_Blue_Post.png"),
        progress: 1,
        expireAt: new Date().getTime() + 1000 * 3600 * 24 * 1,
      },
      {
        name: "Big Smoke Burger",
        distance: 87,
        logo: require("../../public/images/temp/bigsmoke.png"),
        progress: 0,
      },
      {
        name: "Blossom Teas SFU",
        distance: 3212,
        logo: require("../../public/images/temp/blossom-teas.png"),
        progress: 2,
        expireAt: new Date().getTime() + 1000 * 3600 * 24 * 3,
      },
      {
        name: "India Gate",
        distance: 632,
        logo: require("../../public/images/temp/india-gate.png"),
        progress: 2,
      },
      {
        name: "Russet Shack",
        distance: 18,
        logo: require("../../public/images/temp/russet-shack.png"),
        progress: 0,
      },
      {
        name: "Viet Sub",
        distance: 2112,
        logo: require("../../public/images/temp/viet-sub.png"),
        progress: 2,
      },
      {
        name: "Poké Bar SFU",
        distance: 128,
        logo: require("../../public/images/temp/Poke_Bar_Social_Blue_Post.png"),
        progress: 1,
        expireAt: new Date().getTime() + 1000 * 3600 * 24 * 1,
      },
      {
        name: "Big Smoke Burger",
        distance: 87,
        logo: require("../../public/images/temp/bigsmoke.png"),
        progress: 0,
      },
      {
        name: "Blossom Teas SFU",
        distance: 3212,
        logo: require("../../public/images/temp/blossom-teas.png"),
        progress: 2,
        expireAt: new Date().getTime() + 1000 * 3600 * 24 * 3,
      },
      {
        name: "India Gate",
        distance: 632,
        logo: require("../../public/images/temp/india-gate.png"),
        progress: 2,
      },
      {
        name: "Russet Shack",
        distance: 18,
        logo: require("../../public/images/temp/russet-shack.png"),
        progress: 0,
      },
      {
        name: "Viet Sub",
        distance: 2112,
        logo: require("../../public/images/temp/viet-sub.png"),
        progress: 2,
      },
      {
        name: "Poké Bar SFU",
        distance: 128,
        logo: require("../../public/images/temp/Poke_Bar_Social_Blue_Post.png"),
        progress: 1,
        expireAt: new Date().getTime() + 1000 * 3600 * 24 * 1,
      },
      {
        name: "Big Smoke Burger",
        distance: 87,
        logo: require("../../public/images/temp/bigsmoke.png"),
        progress: 0,
      },
      {
        name: "Blossom Teas SFU",
        distance: 3212,
        logo: require("../../public/images/temp/blossom-teas.png"),
        progress: 2,
        expireAt: new Date().getTime() + 1000 * 3600 * 24 * 3,
      },
      {
        name: "India Gate",
        distance: 632,
        logo: require("../../public/images/temp/india-gate.png"),
        progress: 2,
      },
      {
        name: "Russet Shack",
        distance: 18,
        logo: require("../../public/images/temp/russet-shack.png"),
        progress: 0,
      },
      {
        name: "Viet Sub",
        distance: 2112,
        logo: require("../../public/images/temp/viet-sub.png"),
        progress: 2,
      },
      {
        name: "Poké Bar SFU",
        distance: 128,
        logo: require("../../public/images/temp/Poke_Bar_Social_Blue_Post.png"),
        progress: 1,
        expireAt: new Date().getTime() + 1000 * 3600 * 24 * 1,
      },
      {
        name: "Big Smoke Burger",
        distance: 87,
        logo: require("../../public/images/temp/bigsmoke.png"),
        progress: 0,
      },
      {
        name: "Blossom Teas SFU",
        distance: 3212,
        logo: require("../../public/images/temp/blossom-teas.png"),
        progress: 2,
        expireAt: new Date().getTime() + 1000 * 3600 * 24 * 3,
      },
      {
        name: "India Gate",
        distance: 632,
        logo: require("../../public/images/temp/india-gate.png"),
        progress: 2,
      },
      {
        name: "Russet Shack",
        distance: 18,
        logo: require("../../public/images/temp/russet-shack.png"),
        progress: 0,
      },
      {
        name: "Viet Sub",
        distance: 2112,
        logo: require("../../public/images/temp/viet-sub.png"),
        progress: 2,
      },
    ];
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    this.state = {
      dataSource: ds.cloneWithRows(cardContentList),
    }
  }
  
  renderRow(card) {
    return (
        <TouchableOpacity TouchableOpacity style={{paddingHorizontal: 10}} activeOpacity={0.9}
                          onPress={() => this.props.pressCard(card)}>
          <Card {...card} />
        </TouchableOpacity>
    )
  }
  
  render() {
    return <View style={styles.wrapper}>
      <ListView dataSource={this.state.dataSource}
                renderRow={(card) => this.renderRow(card)}
                style={styles.list}>
        {/*<View style={styles.listView}>*/}
        {/*{cards}*/}
        {/*</View>*/}
      </ListView>
    
    </View>
  }
}
;

// Container

const mapDispatchToProps = (dispatch) => {
  return {
    pressCard: (card) => dispatch(homeActions.pressCard(card))
  }
};

export default connect(null, mapDispatchToProps)(CardList);