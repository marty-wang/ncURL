STAT_NAMES = [
    "TotalPercentage",
    "Total",
    "ReceivedPercentage",
    "Received",
    "XferdPercentage",
    "Xferd",
    "AverageDload",
    "SpeedUpload",
    "TimeTotal",
    "TimeSpent",
    "TimeLeft",
    "CurrentSpeed"
]

# STATS = 
#     TotalPercentage   : 0
#     Total             : 1
#     ReceivedPercentage: 2
#     Received          : 3
#     XferdPercentage   : 4
#     Xferd             : 5
#     AverageDload      : 6
#     SpeedUpload       : 7
#     TimeTotal         : 8
#     TimeSpent         : 9
#     TimeLeft          : 10
#     CurrentSpeed      : 11

STATS_COUNT = 0

STATS = {}
STATS[stat] = STATS_COUNT++ for stat in STAT_NAMES

STATS_PATTERN = /[a-zA-Z0-9:-]+/g

###
    get the stat info based on stats string and stat type
    return either an object of all the stats or the specified ones or null if otherwise
    example:
        statsStr = "100 3517k  100 3517k    0     0   215k      0  0:00:16  0:00:16 --:--:-- 47546"
        parseStats statsStr, [STATS.CurrentSpeed, STATS.ReceivedPercentage, STATS.Received, STATS.Total]
###
parseStats = (statsStr = "", stats) ->
    statsArr = statsStr.match STATS_PATTERN

    return null if not statsArr? or statsArr.length < STATS_COUNT

    stats = [0..STATS_COUNT-1] if not stats? or stats.length <= 0
    info = {}
    for stat in stats
        info[stat] = statsArr[stat] if _isInt(stat) && 0 <= stat < STATS_COUNT
    info


### Private ###

_isInt = (n) ->
    typeof n is 'number' && n % 1 == 0;

### exports ###

exports.parseStats = parseStats
exports.STATS = STATS
  