const isSemVer = smv => smv.__isSemver;

const comparePrereleases = (preA, preB) => {
    if (!preA && !preB) return 0;
    if (!preA) return 1;
    if (!preB) return -1;

    const prA = preA.split('.');
    const prB = preB.split('.');

    for (let i = 0; i < prA.length + prB.length; i++) {
        if (!prA[i] && !prB[i]) return 0;
        if (!prA[i]) return -1;
        if (!prB[i]) return 1;
        if (prA[i] === prB[i]) continue;
        if (isNaN(prA[i]) || isNaN(prB[i])) {
            if (prA[i] < prB[i]) return -1;
            if (prA[i] > prB[i]) return 1;
        }
        return prA[i] - prB[i];
    }
};

const clean = version => {
    const withoutV = version.trim().replace(/^[=v]+/, '');
    const plusSign = withoutV.indexOf('+');
    return !~plusSign ? withoutV : withoutV.substring(0, plusSign);
};

const compare = (versionA, versionB) => {
    const a = isSemVer(versionA) ? versionA.version : semver(versionA);
    const b = isSemVer(versionB) ? versionB.version : semver(versionB);

    if (a.major !== b.major) return a.major - b.major;
    if (a.minor !== b.minor) return a.minor - b.minor;

    return a.patch - b.patch || comparePrereleases(a.prerelease, b.prerelease);
};

const diff = (versionA, versionB) => {
    const a = isSemVer(versionA) ? versionA.version : semver(versionA);
    const b = isSemVer(versionB) ? versionB.version : semver(versionB);

    if (a.major !== b.major) return 'major';
    if (a.minor !== b.minor) return 'minor';
    if (a.patch - b.patch) return 'patch';
    if (comparePrereleases(a.prerelease, b.prerelease)) return 'prerelease';
    return null;
};

function semver(versionStr) {
    const version = clean(versionStr);
    const [simple, ...prerelease] = version.split('-');
    const [major, minor, patch] = simple.split('.');
    return {
        major,
        minor,
        patch,
        prerelease: prerelease.join(''),
        version,
        __isSemver: true
    };
}

module.exports = semver;

module.exports.diff = diff;
module.exports.compare = compare;
module.exports.rcompare = (a, b) => compare(b, a);

module.exports.gt = (a, b) => compare(a, b) > 0;
module.exports.lt = (a, b) => compare(a, b) < 0;
module.exports.eq = (a, b) => compare(a, b) === 0;
module.exports.neq = (a, b) => compare(a, b) !== 0;
module.exports.gte = (a, b) => compare(a, b) >= 0;
module.exports.lte = (a, b) => compare(a, b) <= 0;
