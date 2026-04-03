import { ref } from 'vue';
import { defineStore } from 'pinia';
import { listBattleReports } from '@/api/report';
import { listActionLogs } from '@/api/log';
export const useReportStore = defineStore('report', () => {
    const reports = ref([]);
    const logs = ref([]);
    const loadingReports = ref(false);
    const loadingLogs = ref(false);
    async function loadReports(seasonId) {
        loadingReports.value = true;
        try {
            reports.value = await listBattleReports(seasonId);
        }
        finally {
            loadingReports.value = false;
        }
    }
    async function loadLogs(seasonId, factionId) {
        loadingLogs.value = true;
        try {
            logs.value = await listActionLogs(seasonId, factionId);
        }
        finally {
            loadingLogs.value = false;
        }
    }
    return {
        reports,
        logs,
        loadingReports,
        loadingLogs,
        loadReports,
        loadLogs
    };
});
