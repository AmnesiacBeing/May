/*
    “会话”页面，简单点就够了
*/

import React, { Component } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import TitleBar from '../Components/TitleBar';
import I18n from '../I18n';

import ContactItem from '../Components/ContactItem';

export default class ChatPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listViewData: Array(20).fill('').map((_, i) => ({ key: `${i}`, text: `item #${i}` })),
            sectionListData: Array(5).fill('').map((_, i) => ({ title: `title${i + 1}`, data: [...Array(5).fill('').map((_, j) => ({ key: `${i}.${j}`, text: `item #${j}` }))] })),
        };

        this.rowSwipeAnimatedValues = {};
        Array(20).fill('').forEach((_, i) => {
            this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
        });
    }

    closeRow(rowMap, rowKey) {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    deleteRow(rowMap, rowKey) {
        this.closeRow(rowMap, rowKey);
        const newData = [...this.state.listViewData];
        const prevIndex = this.state.listViewData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        this.setState({ listViewData: newData });
    }

    deleteSectionRow(rowMap, rowKey) {
        this.closeRow(rowMap, rowKey);
        var [section, row] = rowKey.split('.');
        const newData = [...this.state.sectionListData];
        const prevIndex = this.state.sectionListData[section].data.findIndex(item => item.key === rowKey);
        newData[section].data.splice(prevIndex, 1);
        this.setState({ sectionListData: newData });
    }

    onRowDidOpen = (rowKey, rowMap) => {
        console.log('This row opened', rowKey);
    }

    onSwipeValueChange = (swipeData) => {
        const { key, value } = swipeData;
        this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
    }

    render() {
        return (
            <View style={styles.container}>
                <TitleBar title={I18n.t('Chats')} />
                <SwipeListView
                    useFlatList
                    data={this.state.listViewData}
                    disableRightSwipe={true}
                    renderItem={(data, rowMap) => (
                        <ContactItem />
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={styles.rowBack}>
                            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={_ => this.deleteRow(rowMap, data.item.key)}>
                                <Text>{I18n.t('delete')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    rightOpenValue={-75}
                    onRowDidOpen={this.onRowDidOpen}
                    onSwipeValueChange={this.onSwipeValueChange}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#abcdef'
    },
    standalone: {
        marginTop: 30,
        marginBottom: 30,
    },
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        justifyContent: 'center',
        height: 50,
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#8BC645',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    backTextWhite: {
        color: '#FFF'
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0
    },
    controls: {
        alignItems: 'center',
        marginBottom: 30
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5
    },
    switch: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 10,
        width: Dimensions.get('window').width / 4,
    },
    trash: {
        height: 25,
        width: 25,
    }
})