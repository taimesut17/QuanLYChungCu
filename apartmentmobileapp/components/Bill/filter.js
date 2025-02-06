import React, { useState } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default DateFilter = ({ onApplyFilter }) => {
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const applyFilter = () => {
    if (startDate > endDate) {
      Alert.alert("Lỗi", "Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }

    setVisible(false);
    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();
    console.log("Start Date: ", formattedStartDate);
    console.log("End Date: ", formattedEndDate);
    onApplyFilter(formattedStartDate, formattedEndDate);
  };

  return (
    <View style={{ backgroundColor: '#e7e7e7', padding: 2, borderRadius: 10 }}>
      <TouchableOpacity
        style={{ display: 'flex', flexDirection: 'row', gap: 3, padding: 10, margin: 3 }}
        onPress={() => setVisible(true)}
      >
        <Icon name="filter" size={26} />
        <Text style={{ fontSize: 15 }}>Bộ lọc ngày</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn khoảng thời gian</Text>

            <View style={styles.datePickerRow}>
              <Text>Ngày bắt đầu:</Text>
              <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowStartPicker(false);
                    if (event.type !== "dismissed" && date) {
                      setStartDate(date);
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.datePickerRow}>
              <Text>Ngày kết thúc:</Text>
              <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                <Text style={styles.dateText}>{endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowEndPicker(false);
                    if (event.type !== "dismissed" && date) {
                      setEndDate(date);
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.buttonRow}>
              <Button title="Áp dụng" color="#4CAF50" onPress={applyFilter} />
              <Button title="Hủy" color="red" onPress={() => setVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
