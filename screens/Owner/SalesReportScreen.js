import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; 

const dailyData = {
    labels: ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"],
    datasets: [
        {
            data: [600, 1200, 850, 1500, 2100, 3500, 1800],
            color: (opacity = 1) => `rgba(100, 181, 246, ${opacity})`, 
            strokeWidth: 2 
        }
    ],
    legend: ["ยอดขายรายวัน (บาท)"]
};

const weeklyData = {
    labels: ["ส.1", "ส.2", "ส.3", "ส.4"],
    datasets: [
        {
            data: [7200, 10500, 8900, 15300],
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, 
            strokeWidth: 2
        }
    ],
    legend: ["ยอดขายรายสัปดาห์ (บาท)"]
};

const screenWidth = Dimensions.get("window").width;

const SalesReportScreen = () => {
    const [reportType, setReportType] = useState('daily'); 
    
    const chartData = reportType === 'daily' ? dailyData : weeklyData;
    const totalSales = chartData.datasets[0].data.reduce((sum, value) => sum + value, 0);

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        decimalPlaces: 0, 
        strokeWidth: 2,
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>สรุปยอดขาย (5.9) 📈</Text>

            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tabButton, reportType === 'daily' && styles.activeTab]}
                    onPress={() => setReportType('daily')}
                >
                    <Text style={[styles.tabText, reportType === 'daily' && styles.activeTabText]}>รายวัน</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tabButton, reportType === 'weekly' && styles.activeTab]}
                    onPress={() => setReportType('weekly')}
                >
                    <Text style={[styles.tabText, reportType === 'weekly' && styles.activeTabText]}>รายสัปดาห์</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>ยอดขายรวมทั้งหมด:</Text>
                <Text style={styles.summaryValue}>
                    ฿{totalSales.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </Text>
            </View>

            <Text style={styles.chartTitle}>กราฟยอดขาย {reportType === 'daily' ? 'รายวัน' : 'รายสัปดาห์'}</Text>
            
            <View style={styles.chartWrapper}>
                <LineChart
                    data={chartData}
                    width={screenWidth - 30} 
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chartStyle}
                />
            </View>
            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#1E88E5',
        borderRadius: 7,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
    },
    summaryBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#777',
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 5,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    chartWrapper: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 5,
        marginBottom: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    chartStyle: {
        borderRadius: 10,
    }
});

export default SalesReportScreen;