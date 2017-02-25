import React from 'react';
import {Text, ScrollView} from 'react-native';
import { List } from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;

const CardList = () => {
  const renderCards = (
      [1,2,3,4,5].map(i => <Item key={i} extra={`card ${i} details`}>card {i}</Item>)
  );
  
  return <ScrollView>
    <List renderHeader={() => 'List of cards'}>
      {renderCards}
    </List>
    
  </ScrollView>
};

export default CardList;