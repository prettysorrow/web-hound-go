delete from instagram.follows;
delete from instagram.user
where username in (
    'alex', 'mia', 'emma', 'max', 'secret_admirer', 'sunny', 'cryptic',
    'luna', 'leo', 'ghost', 'mike', 'nature', 'city', 'buddy', 'wander',
    'critic', 'joe', 'ella', 'sweet', 'john', 'library', 'poet', 'lucy',
    'pro_gamer', 'club', 'beat', 'party', 'zen', 'ray', 'amy', 'calm',
    'salute', 'collector', 'gallery'
);

delete from github.follows;
delete from github.user
where username in (
    'alex', 'mia', 'emma', 'max', 'secret_committer', 'sunny', 'cryptic',
    'luna', 'leo', 'ghost', 'mike', 'open_source', 'react_ninja', 'buddy',
    'js_lover', 'rustacean', 'junior', 'ella', 'wizard', 'john', 'library',
    'poet', 'lucy', 'pro_gamer', 'club', 'beat', 'party', 'zen', 'ray',
    'amy', 'calm', 'salute', 'collector', 'gallery'
);
