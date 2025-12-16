import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import GitHubCalendar from 'react-github-contribution-calendar'
import { fetchGetCalendarData } from '@/service/index'

const panelColors = [
  '#ebedf0', // 0 贡献
  '#9be9a8', // 1-2 贡献
  '#40c463', // 3-4 贡献
  '#30a14e', // 5-6 贡献
  '#216e39', // 7+ 贡献
]

export function ContributionCalendar() {
  const todos = useSelector((state: any) => state.todos.list)
  const [calendarData, setCalendarData] = useState<Record<string, number>>({})

  useEffect(() => {
    const loadCalendarData = async () => {
      const data = await fetchGetCalendarData()
      if (data) {
        setCalendarData(data.data)
      }
    }
    loadCalendarData()
  }, [todos])

  // 计算日期范围：从一年前到今天
  const until = new Date().toISOString().split('T')[0]

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <GitHubCalendar
          values={calendarData}
          until={until}
          panelColors={panelColors}
          weekLabelAttributes={{}}
          monthLabelAttributes={{}}
          panelAttributes={{}}
        />
      </div>
    </div>
  )
}
