import json
import random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(520)
base = Path('/Users/maizhenying/.openclaw/workspace/mall-superapp/packages/mock/mock')

PRODUCT_COUNT = 240
REVIEW_COUNT = 960
ORDER_COUNT = 200
NOTIFICATION_COUNT = 280
FOOTPRINT_COUNT = 360
ADDRESS_COUNT = 30
COUPON_COUNT = 30

categories = [
    ('fashion', '服饰', ['上新', '轻奢', '通勤', '舒适']),
    ('digital', '数码', ['旗舰', '降噪', '高刷', '智能']),
    ('home', '家居', ['收纳', '亲肤', '静音', '环保']),
    ('food', '食品', ['低脂', '鲜享', '礼盒', '囤货'])
]
brands = ['Lumi', 'Nova', 'Aero', 'Mori', 'Zenith', 'Cloudia', 'PixelOne', 'Natura']
name_pool = ['外套', '卫衣', '裤', '耳机', '显示器', '键盘', '床品', '台灯', '零食礼盒', '咖啡豆', '锅具', '空气炸锅']
promo_pool = ['限时购', '买赠', '次日达', '会员价', '满减', '新品首发', '直播同款', '热卖返场']


def money(v):
    return round(v, 2)

products = []
for i in range(1, PRODUCT_COUNT + 1):
    category, cn, tags = categories[(i - 1) % len(categories)]
    brand = brands[i % len(brands)]
    base_price = random.uniform(39, 2499)
    discount_factor = random.uniform(1.08, 1.35)
    price = money(base_price)
    origin = money(price * discount_factor)
    color_values = ['曜黑', '珍珠白', '薄荷绿', '海盐蓝', '奶咖']
    size_values = ['S', 'M', 'L', 'XL'] if category == 'fashion' else ['标准版', '高配版', 'Pro']
    specs = [
        {'name': '颜色', 'values': color_values[:4]},
        {'name': '规格', 'values': size_values}
    ]
    skus = []
    sku_i = 1
    for c in specs[0]['values'][:3]:
        for s in specs[1]['values'][:3]:
            skus.append({
                'id': f'p{i}-sku{sku_i}',
                'attrs': {'颜色': c, '规格': s},
                'stock': random.randint(5, 80),
                'price': money(price * random.uniform(0.96, 1.05))
            })
            sku_i += 1
    products.append({
        'id': f'p{i}',
        'title': f'{brand}{name_pool[i % len(name_pool)]} {2027 + (i % 2)}款',
        'subtitle': f'{cn}人气单品，适配高频使用场景',
        'brand': brand,
        'price': price,
        'originPrice': origin,
        'image': f'https://picsum.photos/seed/mall-{i}/400/300',
        'images': [
            f'https://picsum.photos/seed/mall-{i}-1/1000/800',
            f'https://picsum.photos/seed/mall-{i}-2/1000/800',
            f'https://picsum.photos/seed/mall-{i}-3/1000/800'
        ],
        'category': category,
        'tags': random.sample(tags, 2),
        'promoTags': random.sample(promo_pool, 2),
        'stock': random.randint(20, 600),
        'soldCount': random.randint(30, 9800),
        'rating': round(random.uniform(3.2, 5.0), 1),
        'reviewCount': random.randint(20, 1200),
        'description': f'{brand}{name_pool[i % len(name_pool)]}，覆盖日常与进阶场景，支持7天无忧退换。',
        'specs': specs,
        'skus': skus
    })

review_templates = [
    '物流很快，包装完整。',
    '做工扎实，细节到位。',
    '价格合适，回购意愿高。',
    '体验一般，存在改进空间。',
    '超出预期，家人都很喜欢。'
]
reviews = []
start_date = datetime(2026, 1, 1)
for i in range(1, REVIEW_COUNT + 1):
    rating = random.choices([5, 4, 3, 2, 1], weights=[38, 34, 16, 8, 4])[0]
    created = (start_date + timedelta(days=i % 85)).strftime('%Y-%m-%d')
    data = {
        'id': f'r{i}',
        'productId': f'p{((i - 1) % PRODUCT_COUNT) + 1}',
        'user': f'用户{(i % 500) + 1:03d}',
        'rating': rating,
        'content': f"{random.choice(review_templates)} 第{i}条评价。",
        'createdAt': created
    }
    if random.random() < 0.36:
        img_count = random.randint(1, 4)
        data['images'] = [f'https://picsum.photos/seed/review-{i}-{k}/200/200' for k in range(1, img_count + 1)]
    if random.random() < 0.28:
        data['appendComment'] = random.choice(['使用一周后追评：稳定，性价比不错。', '追评：售后响应及时，问题已解决。', '追评：二次回购依然满意。'])
    reviews.append(data)

order_statuses = ['pending', 'paid', 'shipping', 'done', 'cancelled', 'out_of_stock', 'refund_processing', 'refund_done']
status_weights = [20, 10, 18, 30, 7, 5, 6, 4]
orders = []
for i in range(1, ORDER_COUNT + 1):
    dt = start_date + timedelta(days=i % 90, hours=i % 12)
    orders.append({
        'id': f'o202603{i:04d}',
        'amount': money(random.uniform(66, 4699)),
        'status': random.choices(order_statuses, weights=status_weights)[0],
        'createdAt': dt.strftime('%Y-%m-%d %H:%M'),
        'itemCount': random.randint(1, 6)
    })

notification_types = ['logistics', 'promo', 'price_drop', 'service']
notifications = []
for i in range(1, NOTIFICATION_COUNT + 1):
    t = notification_types[i % len(notification_types)]
    dt = start_date + timedelta(days=i % 75, hours=(i * 2) % 24, minutes=(i * 5) % 60)
    notifications.append({
        'id': f'n{i}',
        'title': f'{t}通知 #{i}',
        'content': f'这是第{i}条{t}消息，请及时查看。',
        'type': t,
        'createdAt': dt.strftime('%Y-%m-%d %H:%M'),
        'read': random.random() > 0.42
    })

sources = ['home', 'search', 'activity', 'recommend']
footprints = []
for i in range(1, FOOTPRINT_COUNT + 1):
    dt = start_date + timedelta(days=i % 80, hours=(i + 8) % 24, minutes=(i * 3) % 60)
    footprints.append({
        'id': f'p{((i * 3) % PRODUCT_COUNT) + 1}',
        'viewedAt': dt.strftime('%Y-%m-%d %H:%M'),
        'source': random.choice(sources)
    })

cities = ['上海', '北京', '杭州', '成都', '深圳', '广州', '南京', '苏州']
names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九']
addresses = []
for i in range(1, ADDRESS_COUNT + 1):
    addresses.append({
        'id': f'a{i}',
        'name': f'{random.choice(names)}{i}',
        'phone': f'1380000{i:04d}',
        'city': random.choice(cities),
        'detail': f'星河路{i}号 {random.randint(1, 30)}栋{random.randint(101, 2802)}室',
        'isDefault': i == 1
    })

coupon_templates = [
    ('满99减10', 10, 99), ('满199减25', 25, 199), ('满299减40', 40, 299), ('满399减60', 60, 399),
    ('数码专享券', 80, 699), ('服饰品类券', 35, 259), ('家居品类券', 45, 299), ('食品加购券', 18, 89),
    ('会员日券', 88, 599), ('新人首单券', 20, 89)
]
coupons = []
for i in range(1, COUPON_COUNT + 1):
    title, discount, min_spend = coupon_templates[(i - 1) % len(coupon_templates)]
    exp = (datetime(2026, 4, 1) + timedelta(days=7 * (i % 10))).strftime('%Y-%m-%d')
    coupons.append({
        'id': f'c{i}',
        'title': f'{title}{"" if i <= 10 else f"·{i}"}',
        'discount': discount + (0 if i <= 10 else (i % 4) * 2),
        'minSpend': min_spend + (0 if i <= 10 else (i % 5) * 20),
        'expireAt': exp
    })

for name, data in {
    'products.json': products,
    'reviews.json': reviews,
    'orders.json': orders,
    'notifications.json': notifications,
    'footprints.json': footprints,
    'addresses.json': addresses,
    'coupons.json': coupons,
}.items():
    (base / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

print('generated', {k: len(v) for k, v in {
    'products': products,
    'reviews': reviews,
    'orders': orders,
    'notifications': notifications,
    'footprints': footprints,
    'addresses': addresses,
    'coupons': coupons,
}.items()})
